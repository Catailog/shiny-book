import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ORDER_STATUS } from '@/constants/order-status';

vi.mock('@/env', () => ({ env: { APP_URL: 'http://localhost:3000' } }));

const loggerMock = { info: vi.fn(), warn: vi.fn() };
vi.mock('@/lib/log/logger', () => ({ logger: loggerMock }));

vi.mock('@/emails/order-status-changed', () => ({
  OrderStatusChangedEmail: () => null,
}));

const getUserByIdMock = vi.fn();
vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({
    auth: { admin: { getUserById: getUserByIdMock } },
  }),
}));

const getResendClientMock = vi.fn();
vi.mock('@/lib/email/client', () => ({
  getResendClient: getResendClientMock,
}));

const resolveMxMock = vi.fn();
vi.mock('node:dns/promises', () => ({
  default: { resolveMx: resolveMxMock },
  resolveMx: resolveMxMock,
}));

const { sendOrderStatusEmail } = await import('./send-order-status-email');

function buildOrder(overrides: { consumer_id?: string | null } = {}) {
  return {
    id: 'order-abcdef01-2345',
    consumer_id: 'consumer-1',
    ...overrides,
  };
}

function mockRecipient(userMetadata: Record<string, unknown> = {}, email = 'reader@example.com') {
  getUserByIdMock.mockResolvedValueOnce({
    data: { user: { id: 'consumer-1', email, user_metadata: userMetadata } },
    error: null,
  });
}

function mockSend() {
  const send = vi.fn().mockResolvedValue({ data: { id: 'email-1' }, error: null });
  getResendClientMock.mockReturnValue({ emails: { send } });
  return send;
}

beforeEach(() => {
  vi.clearAllMocks();
  resolveMxMock.mockResolvedValue([{ exchange: 'mx.example.com', priority: 10 }]);
});

describe('sendOrderStatusEmail', () => {
  it('does not look up the consumer when the transition is not notifiable', async () => {
    await sendOrderStatusEmail({
      order: buildOrder(),
      fromStatus: ORDER_STATUS.PRINTING,
      toStatus: ORDER_STATUS.BINDING,
    });

    expect(getUserByIdMock).not.toHaveBeenCalled();
  });

  it('skips when the order has no consumer', async () => {
    await sendOrderStatusEmail({
      order: buildOrder({ consumer_id: null }),
      fromStatus: ORDER_STATUS.PAID,
      toStatus: ORDER_STATUS.SHIPPING,
    });

    expect(getUserByIdMock).not.toHaveBeenCalled();
    expect(loggerMock.info).toHaveBeenCalledWith(
      expect.anything(),
      'order status email skipped: order has no consumer',
    );
  });

  it('skips when the consumer opted out', async () => {
    mockRecipient({ orderStatusEmailConsent: false });
    const send = mockSend();

    await sendOrderStatusEmail({
      order: buildOrder(),
      fromStatus: ORDER_STATUS.PAID,
      toStatus: ORDER_STATUS.SHIPPING,
    });

    expect(send).not.toHaveBeenCalled();
    expect(loggerMock.info).toHaveBeenCalledWith(
      expect.anything(),
      'order status email skipped: consumer opted out',
    );
  });

  it('skips a blocklisted recipient domain', async () => {
    mockRecipient({}, 'ops@catailog.com');
    const send = mockSend();

    await sendOrderStatusEmail({
      order: buildOrder(),
      fromStatus: ORDER_STATUS.PAID,
      toStatus: ORDER_STATUS.SHIPPING,
    });

    expect(send).not.toHaveBeenCalled();
  });

  it('skips when the recipient domain has no MX record', async () => {
    mockRecipient();
    const send = mockSend();
    const dnsError = Object.assign(new Error('queryMx ENOTFOUND'), { code: 'ENOTFOUND' });
    resolveMxMock.mockRejectedValueOnce(dnsError);

    await sendOrderStatusEmail({
      order: buildOrder(),
      fromStatus: ORDER_STATUS.PAID,
      toStatus: ORDER_STATUS.SHIPPING,
    });

    expect(send).not.toHaveBeenCalled();
    expect(loggerMock.info).toHaveBeenCalledWith(
      expect.anything(),
      'order status email skipped: no MX record',
    );
  });

  it('still sends when the MX lookup fails inconclusively', async () => {
    mockRecipient();
    const send = mockSend();
    const dnsError = Object.assign(new Error('queryMx ETIMEOUT'), { code: 'ETIMEOUT' });
    resolveMxMock.mockRejectedValueOnce(dnsError);

    await sendOrderStatusEmail({
      order: buildOrder(),
      fromStatus: ORDER_STATUS.PAID,
      toStatus: ORDER_STATUS.SHIPPING,
    });

    expect(send).toHaveBeenCalledTimes(1);
  });

  it('logs "would send" and does not send when RESEND_API_KEY is unset', async () => {
    mockRecipient();
    getResendClientMock.mockReturnValue(null);

    await sendOrderStatusEmail({
      order: buildOrder(),
      fromStatus: ORDER_STATUS.PAID,
      toStatus: ORDER_STATUS.SHIPPING,
    });

    expect(loggerMock.info).toHaveBeenCalledWith(
      expect.anything(),
      'order status email: RESEND_API_KEY unset, would send',
    );
  });

  it('sends with the subject and locale from the consumer profile', async () => {
    mockRecipient({ locale: 'en', name: 'Jane' });
    const send = mockSend();

    await sendOrderStatusEmail({
      order: buildOrder(),
      fromStatus: ORDER_STATUS.PAID,
      toStatus: ORDER_STATUS.SHIPPING,
    });

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'reader@example.com',
        subject: 'Your order is on its way',
      }),
    );
  });

  it('falls back to the default locale when the stored locale is invalid', async () => {
    mockRecipient({ locale: 'fr' });
    const send = mockSend();

    await sendOrderStatusEmail({
      order: buildOrder(),
      fromStatus: ORDER_STATUS.PAID,
      toStatus: ORDER_STATUS.SHIPPING,
    });

    expect(send).toHaveBeenCalledWith(expect.objectContaining({ subject: '배송을 시작했습니다' }));
  });

  it('swallows a send failure and logs a warning', async () => {
    mockRecipient();
    const send = vi.fn().mockResolvedValue({ data: null, error: { message: 'rate limited' } });
    getResendClientMock.mockReturnValue({ emails: { send } });

    await expect(
      sendOrderStatusEmail({
        order: buildOrder(),
        fromStatus: ORDER_STATUS.PAID,
        toStatus: ORDER_STATUS.SHIPPING,
      }),
    ).resolves.toBeUndefined();

    expect(loggerMock.warn).toHaveBeenCalledWith(
      expect.anything(),
      'order status email send failed',
    );
  });
});

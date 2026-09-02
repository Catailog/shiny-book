import { beforeEach, describe, expect, it, vi } from 'vitest';

const insertMock = vi.fn();

vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

const warnMock = vi.fn();
const errorMock = vi.fn();
vi.mock('@/lib/log/logger', () => ({
  logger: { warn: warnMock, error: errorMock, info: vi.fn() },
}));

const { ORDER_EVENT_SOURCE, ORDER_EVENT_TYPE } = await import('@/constants/order-event');
const { ORDER_STATUS } = await import('@/constants/order-status');
const { recordOrderEvent } = await import('@/lib/orders/record-order-event');

beforeEach(() => {
  vi.clearAllMocks();
  insertMock.mockResolvedValue({ error: null });
});

describe('recordOrderEvent', () => {
  it('appends a row with parsed metadata and null-filled optional columns', async () => {
    await recordOrderEvent({
      orderId: 'order-1',
      eventType: ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED,
      source: ORDER_EVENT_SOURCE.WEBHOOK,
      actor: 'webhook:toss',
      fromStatus: ORDER_STATUS.AWAITING_PAYMENT,
      toStatus: ORDER_STATUS.PAID,
      metadata: { paymentKey: 'pk_1', secret: 'stripped' },
    });

    expect(insertMock).toHaveBeenCalledWith({
      order_id: 'order-1',
      event_type: ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED,
      source: ORDER_EVENT_SOURCE.WEBHOOK,
      actor: 'webhook:toss',
      from_status: ORDER_STATUS.AWAITING_PAYMENT,
      to_status: ORDER_STATUS.PAID,
      reason: null,
      metadata: { paymentKey: 'pk_1' },
    });
  });

  it('omits actor when not provided so the column default applies', async () => {
    await recordOrderEvent({
      orderId: 'order-1',
      eventType: ORDER_EVENT_TYPE.ADMIN_NOTE,
      source: ORDER_EVENT_SOURCE.ADMIN,
      reason: 'called the customer',
    });

    const payload = insertMock.mock.calls[0]?.[0];
    expect(payload).not.toHaveProperty('actor');
    expect(payload.reason).toBe('called the customer');
  });

  it('stores empty metadata and warns when metadata does not match the schema', async () => {
    await recordOrderEvent({
      orderId: 'order-1',
      eventType: ORDER_EVENT_TYPE.WEBHOOK_RECEIVED,
      source: ORDER_EVENT_SOURCE.WEBHOOK,
      metadata: { provider: 'unknown-provider' },
    });

    expect(warnMock).toHaveBeenCalledOnce();
    expect(insertMock.mock.calls[0]?.[0].metadata).toEqual({});
  });

  it('does not throw and logs when the insert fails', async () => {
    insertMock.mockResolvedValueOnce({ error: { message: 'boom', code: '500' } });

    await expect(
      recordOrderEvent({
        orderId: 'order-1',
        eventType: ORDER_EVENT_TYPE.ORDER_CREATED,
        source: ORDER_EVENT_SOURCE.SYSTEM,
      }),
    ).resolves.toBeUndefined();

    expect(errorMock).toHaveBeenCalledOnce();
  });
});

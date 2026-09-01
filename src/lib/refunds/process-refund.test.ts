import { beforeEach, describe, expect, it, vi } from 'vitest';

let mockAllowTestPayment = true;
vi.mock('@/env', () => ({
  env: {
    get ALLOW_TEST_PAYMENT() {
      return mockAllowTestPayment;
    },
  },
}));

const requestFetchMock = vi.fn();
const orderUpdateMock = vi.fn();

vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: requestFetchMock }) }),
      update: () => ({
        eq: () => ({
          eq: () => ({ select: () => ({ maybeSingle: orderUpdateMock }) }),
          then: (resolve: (value: unknown) => void) => resolve({}),
        }),
      }),
    }),
  }),
}));

const getOrderByIdMock = vi.fn();
vi.mock('@/lib/orders/get-order-by-id', () => ({ getOrderById: getOrderByIdMock }));

const recordOrderEventMock = vi.fn();
vi.mock('@/lib/orders/record-order-event', () => ({ recordOrderEvent: recordOrderEventMock }));

const cancelTossPaymentMock = vi.fn();
vi.mock('@/lib/payments/toss-cancel-payment', () => ({ cancelTossPayment: cancelTossPaymentMock }));

const { ORDER_STATUS } = await import('@/constants/order-status');
const { ORDER_EVENT_TYPE } = await import('@/constants/order-event');
const { REFUND_STATUS } = await import('@/constants/refund');
const { processRefund } = await import('@/lib/refunds/process-refund');

function buildRequest(overrides: Record<string, unknown> = {}) {
  return {
    id: 'rr-1',
    order_id: 'order-1',
    amount: null,
    reason: '파손',
    status: REFUND_STATUS.APPROVED,
    ...overrides,
  };
}

function buildOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'order-1',
    status: ORDER_STATUS.PAID,
    amount: 30000,
    refunded_amount: 0,
    payment_key: 'pk_1',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockAllowTestPayment = true;
  requestFetchMock.mockResolvedValue({ data: buildRequest() });
  getOrderByIdMock.mockResolvedValue(buildOrder());
  cancelTossPaymentMock.mockResolvedValue({ isCancelled: true, transactionKey: 'txn_1' });
  orderUpdateMock.mockResolvedValue({ data: { id: 'order-1' } });
});

describe('processRefund', () => {
  it('processes a full refund: marks the order refunded and records two events', async () => {
    const result = await processRefund('rr-1');

    expect(result).toEqual({ outcome: 'completed', refundedAmount: 30000, fullyRefunded: true });
    expect(cancelTossPaymentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentKey: 'pk_1',
        cancelReason: '파손',
        cancelAmount: undefined,
      }),
    );
    const eventTypes = recordOrderEventMock.mock.calls.map((call) => call[0].eventType);
    expect(eventTypes).toEqual([
      ORDER_EVENT_TYPE.REFUND_COMPLETED,
      ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED,
    ]);
  });

  it('processes a partial refund: leaves status and records only the completion event', async () => {
    requestFetchMock.mockResolvedValueOnce({ data: buildRequest({ amount: 5000 }) });

    const result = await processRefund('rr-1');

    expect(result).toEqual({ outcome: 'completed', refundedAmount: 5000, fullyRefunded: false });
    expect(cancelTossPaymentMock).toHaveBeenCalledWith(
      expect.objectContaining({ cancelAmount: 5000 }),
    );
    expect(recordOrderEventMock).toHaveBeenCalledTimes(1);
    expect(recordOrderEventMock.mock.calls[0]?.[0].eventType).toBe(
      ORDER_EVENT_TYPE.REFUND_COMPLETED,
    );
  });

  it('returns not_found for a missing request', async () => {
    requestFetchMock.mockResolvedValueOnce({ data: null });
    expect(await processRefund('rr-x')).toEqual({ outcome: 'not_found' });
  });

  it('returns not_processable when the request is not approved or failed', async () => {
    requestFetchMock.mockResolvedValueOnce({
      data: buildRequest({ status: REFUND_STATUS.REQUESTED }),
    });
    expect(await processRefund('rr-1')).toEqual({ outcome: 'not_processable' });
  });

  it('returns order_missing when the order cannot be loaded', async () => {
    getOrderByIdMock.mockResolvedValueOnce(null);
    expect(await processRefund('rr-1')).toEqual({ outcome: 'order_missing' });
  });

  it('fails when the order has no stored payment key and test payments are off', async () => {
    mockAllowTestPayment = false;
    getOrderByIdMock.mockResolvedValueOnce(buildOrder({ payment_key: null }));

    const result = await processRefund('rr-1');

    expect(result).toEqual({
      outcome: 'provider_failed',
      errorMessage: 'Order has no stored payment key',
    });
    expect(cancelTossPaymentMock).not.toHaveBeenCalled();
  });

  it('still processes a refund with no payment key in the test-payment environment', async () => {
    getOrderByIdMock.mockResolvedValueOnce(buildOrder({ payment_key: null }));

    const result = await processRefund('rr-1');

    expect(result.outcome).toBe('completed');
    expect(cancelTossPaymentMock).toHaveBeenCalled();
  });

  it('surfaces a provider cancellation failure', async () => {
    cancelTossPaymentMock.mockResolvedValueOnce({ isCancelled: false, errorMessage: '취소 불가' });

    expect(await processRefund('rr-1')).toEqual({
      outcome: 'provider_failed',
      errorMessage: '취소 불가',
    });
    expect(recordOrderEventMock).not.toHaveBeenCalled();
  });

  it('returns failed when the conditional order update matches no row', async () => {
    orderUpdateMock.mockResolvedValueOnce({ data: null });

    expect(await processRefund('rr-1')).toEqual({ outcome: 'failed' });
    expect(recordOrderEventMock).not.toHaveBeenCalled();
  });
});

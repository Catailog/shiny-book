import { beforeEach, describe, expect, it, vi } from 'vitest';

const getOrderByIdMock = vi.fn();
vi.mock('@/lib/orders/get-order-by-id', () => ({
  getOrderById: getOrderByIdMock,
}));

const recordOrderEventMock = vi.fn();
vi.mock('@/lib/orders/record-order-event', () => ({
  recordOrderEvent: recordOrderEventMock,
}));

const openRequestsMock = vi.fn();
const insertSingleMock = vi.fn();
vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ in: openRequestsMock }) }),
      insert: () => ({ select: () => ({ single: insertSingleMock }) }),
    }),
  }),
}));

const { ORDER_STATUS } = await import('@/constants/order-status');
const { ORDER_EVENT_TYPE } = await import('@/constants/order-event');
const { requestRefund } = await import('@/lib/refunds/request-refund');

function buildOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'order-1',
    consumer_id: 'consumer-1',
    status: ORDER_STATUS.PAID,
    amount: 30000,
    refunded_amount: 0,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  openRequestsMock.mockResolvedValue({ data: [] });
  insertSingleMock.mockResolvedValue({ data: { id: 'rr-1' }, error: null });
});

describe('requestRefund', () => {
  it('creates a request and records an event for a refundable order', async () => {
    getOrderByIdMock.mockResolvedValueOnce(buildOrder());

    const result = await requestRefund('order-1', 'consumer-1', { reason: '변심' });

    expect(result).toEqual({ outcome: 'created', refundRequestId: 'rr-1' });
    expect(recordOrderEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-1',
        eventType: ORDER_EVENT_TYPE.REFUND_REQUESTED,
        metadata: { refundRequestId: 'rr-1' },
      }),
    );
  });

  it('rejects when the caller does not own the order', async () => {
    getOrderByIdMock.mockResolvedValueOnce(buildOrder({ consumer_id: 'someone-else' }));

    expect(await requestRefund('order-1', 'consumer-1', { reason: 'x' })).toEqual({
      outcome: 'order_not_found',
    });
  });

  it('rejects when the order status is not refundable', async () => {
    getOrderByIdMock.mockResolvedValueOnce(buildOrder({ status: ORDER_STATUS.AWAITING_PAYMENT }));

    expect(await requestRefund('order-1', 'consumer-1', { reason: 'x' })).toEqual({
      outcome: 'not_refundable',
    });
  });

  it('rejects a partial amount larger than the remaining refundable amount', async () => {
    getOrderByIdMock.mockResolvedValueOnce(buildOrder({ amount: 30000, refunded_amount: 25000 }));

    expect(await requestRefund('order-1', 'consumer-1', { reason: 'x', amount: 6000 })).toEqual({
      outcome: 'amount_exceeds_remaining',
      remaining: 5000,
    });
  });

  it('rejects when an open request already exists', async () => {
    getOrderByIdMock.mockResolvedValueOnce(buildOrder());
    openRequestsMock.mockResolvedValueOnce({ data: [{ id: 'rr-existing' }] });

    expect(await requestRefund('order-1', 'consumer-1', { reason: 'x' })).toEqual({
      outcome: 'already_open',
    });
    expect(insertSingleMock).not.toHaveBeenCalled();
  });

  it('does not record an event when the insert fails', async () => {
    getOrderByIdMock.mockResolvedValueOnce(buildOrder());
    insertSingleMock.mockResolvedValueOnce({ data: null, error: { message: 'boom' } });

    expect(await requestRefund('order-1', 'consumer-1', { reason: 'x' })).toEqual({
      outcome: 'failed',
    });
    expect(recordOrderEventMock).not.toHaveBeenCalled();
  });
});

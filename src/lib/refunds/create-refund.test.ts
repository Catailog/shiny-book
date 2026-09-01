import { beforeEach, describe, expect, it, vi } from 'vitest';

const getOrderByIdMock = vi.fn();
vi.mock('@/lib/orders/get-order-by-id', () => ({ getOrderById: getOrderByIdMock }));

const processRefundMock = vi.fn();
vi.mock('@/lib/refunds/process-refund', () => ({ processRefund: processRefundMock }));

const insertSingleMock = vi.fn();
const insertMock = vi.fn(() => ({ select: () => ({ single: insertSingleMock }) }));
vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

const { ORDER_STATUS } = await import('@/constants/order-status');
const { ADMIN_INITIATED_REFUND_REASON, REFUND_STATUS } = await import('@/constants/refund');
const { createRefund } = await import('@/lib/refunds/create-refund');

function buildOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'order-1',
    status: ORDER_STATUS.PAID,
    amount: 30000,
    refunded_amount: 0,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  getOrderByIdMock.mockResolvedValue(buildOrder());
  insertSingleMock.mockResolvedValue({ data: { id: 'rr-1' }, error: null });
  processRefundMock.mockResolvedValue({
    outcome: 'completed',
    refundedAmount: 30000,
    fullyRefunded: true,
  });
});

describe('createRefund', () => {
  it('records a pre-approved request with the sentinel reason and processes it', async () => {
    const result = await createRefund('order-1', 'admin-1', {});

    expect(result).toEqual({ outcome: 'completed', refundedAmount: 30000, fullyRefunded: true });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        order_id: 'order-1',
        requested_by: 'admin-1',
        reviewed_by: 'admin-1',
        reason: ADMIN_INITIATED_REFUND_REASON,
        review_note: null,
        amount: null,
        status: REFUND_STATUS.APPROVED,
      }),
    );
    expect(processRefundMock).toHaveBeenCalledWith('rr-1');
  });

  it('stores a provided note in both reason and review_note', async () => {
    await createRefund('order-1', 'admin-1', { note: '  파손 보상  ', amount: 5000 });

    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ reason: '파손 보상', review_note: '파손 보상', amount: 5000 }),
    );
  });

  it('rejects a non-refundable order status', async () => {
    getOrderByIdMock.mockResolvedValueOnce(buildOrder({ status: ORDER_STATUS.AWAITING_PAYMENT }));
    expect(await createRefund('order-1', 'admin-1', {})).toEqual({ outcome: 'not_refundable' });
    expect(processRefundMock).not.toHaveBeenCalled();
  });

  it('rejects an amount over the remaining refundable amount', async () => {
    getOrderByIdMock.mockResolvedValueOnce(buildOrder({ amount: 30000, refunded_amount: 25000 }));
    expect(await createRefund('order-1', 'admin-1', { amount: 6000 })).toEqual({
      outcome: 'amount_exceeds_remaining',
      remaining: 5000,
    });
  });

  it('maps a provider failure to process_failed', async () => {
    processRefundMock.mockResolvedValueOnce({ outcome: 'provider_failed', errorMessage: 'x' });
    expect(await createRefund('order-1', 'admin-1', {})).toEqual({ outcome: 'process_failed' });
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const selectMaybeSingleMock = vi.fn();
const updateMaybeSingleMock = vi.fn();
vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: selectMaybeSingleMock }) }),
      update: () => ({
        eq: () => ({ eq: () => ({ select: () => ({ maybeSingle: updateMaybeSingleMock }) }) }),
      }),
    }),
  }),
}));

const recordOrderEventMock = vi.fn();
vi.mock('@/lib/orders/record-order-event', () => ({
  recordOrderEvent: recordOrderEventMock,
}));

const { ORDER_EVENT_TYPE } = await import('@/constants/order-event');
const { REFUND_STATUS } = await import('@/constants/refund');
const { reviewRefund } = await import('@/lib/refunds/review-refund');

beforeEach(() => {
  vi.clearAllMocks();
  selectMaybeSingleMock.mockResolvedValue({
    data: { id: 'rr-1', order_id: 'order-1', status: REFUND_STATUS.REQUESTED },
  });
  updateMaybeSingleMock.mockResolvedValue({ data: { id: 'rr-1' } });
});

describe('reviewRefund', () => {
  it('approves a pending request and records refund.approved', async () => {
    const result = await reviewRefund('rr-1', 'admin-1', 'approve', { note: '확인' });

    expect(result).toEqual({ outcome: 'approved', orderId: 'order-1' });
    expect(recordOrderEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-1',
        eventType: ORDER_EVENT_TYPE.REFUND_APPROVED,
        actor: 'admin-1',
        metadata: { refundRequestId: 'rr-1' },
      }),
    );
  });

  it('rejects a pending request and records refund.rejected', async () => {
    const result = await reviewRefund('rr-1', 'admin-1', 'reject', {});

    expect(result).toEqual({ outcome: 'rejected', orderId: 'order-1' });
    expect(recordOrderEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: ORDER_EVENT_TYPE.REFUND_REJECTED }),
    );
  });

  it('returns not_found when the request does not exist', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: null });
    expect(await reviewRefund('rr-x', 'admin-1', 'approve', {})).toEqual({ outcome: 'not_found' });
  });

  it('returns not_pending when the request was already reviewed', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({
      data: { id: 'rr-1', order_id: 'order-1', status: REFUND_STATUS.APPROVED },
    });
    expect(await reviewRefund('rr-1', 'admin-1', 'approve', {})).toEqual({
      outcome: 'not_pending',
    });
    expect(updateMaybeSingleMock).not.toHaveBeenCalled();
  });

  it('returns failed when the conditional update matches no row', async () => {
    updateMaybeSingleMock.mockResolvedValueOnce({ data: null });
    expect(await reviewRefund('rr-1', 'admin-1', 'approve', {})).toEqual({ outcome: 'failed' });
    expect(recordOrderEventMock).not.toHaveBeenCalled();
  });
});

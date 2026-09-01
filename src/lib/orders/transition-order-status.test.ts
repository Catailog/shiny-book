import { beforeEach, describe, expect, it, vi } from 'vitest';

const updateMaybeSingleMock = vi.fn();

vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({
    from: () => ({
      update: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              maybeSingle: updateMaybeSingleMock,
            }),
          }),
        }),
      }),
    }),
  }),
}));

const recordOrderEventMock = vi.fn();
vi.mock('@/lib/orders/record-order-event', () => ({
  recordOrderEvent: recordOrderEventMock,
}));

const { ORDER_STATUS } = await import('@/constants/order-status');
const { ORDER_EVENT_SOURCE, ORDER_EVENT_TYPE } = await import('@/constants/order-event');
const { transitionOrderStatus } = await import('@/lib/orders/transition-order-status');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('transitionOrderStatus', () => {
  it('returns null without querying when the transition is not allowed', async () => {
    const result = await transitionOrderStatus(
      'order-1',
      ORDER_STATUS.AWAITING_PAYMENT,
      ORDER_STATUS.SHIPPING,
      { source: ORDER_EVENT_SOURCE.ADMIN },
    );

    expect(result).toBeNull();
    expect(updateMaybeSingleMock).not.toHaveBeenCalled();
    expect(recordOrderEventMock).not.toHaveBeenCalled();
  });

  it('returns the updated order and records an event when the conditional update succeeds', async () => {
    updateMaybeSingleMock.mockResolvedValueOnce({
      data: { id: 'order-1', status: ORDER_STATUS.BINDING },
    });

    const result = await transitionOrderStatus(
      'order-1',
      ORDER_STATUS.PRINTING,
      ORDER_STATUS.BINDING,
      { source: ORDER_EVENT_SOURCE.WEBHOOK, actor: 'webhook:print-shop' },
    );

    expect(result).toEqual({ id: 'order-1', status: ORDER_STATUS.BINDING });
    expect(recordOrderEventMock).toHaveBeenCalledWith({
      orderId: 'order-1',
      eventType: ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED,
      source: ORDER_EVENT_SOURCE.WEBHOOK,
      actor: 'webhook:print-shop',
      fromStatus: ORDER_STATUS.PRINTING,
      toStatus: ORDER_STATUS.BINDING,
      reason: undefined,
      metadata: undefined,
    });
  });

  it('returns null and records nothing when the conditional update matches no rows', async () => {
    updateMaybeSingleMock.mockResolvedValueOnce({ data: null });

    const result = await transitionOrderStatus(
      'order-1',
      ORDER_STATUS.PRINTING,
      ORDER_STATUS.BINDING,
      { source: ORDER_EVENT_SOURCE.ADMIN },
    );

    expect(result).toBeNull();
    expect(recordOrderEventMock).not.toHaveBeenCalled();
  });
});

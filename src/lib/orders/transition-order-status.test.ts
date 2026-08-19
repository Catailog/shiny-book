import { describe, expect, it, vi } from 'vitest';

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

const { ORDER_STATUS } = await import('@/constants/order-status');
const { transitionOrderStatus } = await import('@/lib/orders/transition-order-status');

describe('transitionOrderStatus', () => {
  it('returns null without querying when the transition is not allowed', async () => {
    const result = await transitionOrderStatus(
      'order-1',
      ORDER_STATUS.AWAITING_PAYMENT,
      ORDER_STATUS.SHIPPING,
    );

    expect(result).toBeNull();
    expect(updateMaybeSingleMock).not.toHaveBeenCalled();
  });

  it('returns the updated order when the conditional update succeeds', async () => {
    updateMaybeSingleMock.mockResolvedValueOnce({
      data: { id: 'order-1', status: ORDER_STATUS.BINDING },
    });

    const result = await transitionOrderStatus(
      'order-1',
      ORDER_STATUS.PRINTING,
      ORDER_STATUS.BINDING,
    );

    expect(result).toEqual({ id: 'order-1', status: ORDER_STATUS.BINDING });
  });

  it('returns null when the conditional update matches no rows', async () => {
    updateMaybeSingleMock.mockResolvedValueOnce({ data: null });

    const result = await transitionOrderStatus(
      'order-1',
      ORDER_STATUS.PRINTING,
      ORDER_STATUS.BINDING,
    );

    expect(result).toBeNull();
  });
});

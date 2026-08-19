import { beforeEach, describe, expect, it, vi } from 'vitest';

const selectMaybeSingleMock = vi.fn();
const updateMaybeSingleMock = vi.fn();

vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: selectMaybeSingleMock,
        }),
      }),
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

const { redeemCoupon, calculateDiscountedAmount } = await import('@/lib/coupons/redeem-coupon');

function buildCoupon(overrides: Record<string, unknown> = {}) {
  return {
    id: 'coupon-1',
    code: 'WELCOME10',
    discount_type: 'percentage',
    discount_value: 10,
    max_uses: null,
    used_count: 0,
    is_active: true,
    expires_at: null,
    created_at: '2026-08-13T00:00:00.000Z',
    ...overrides,
  };
}

beforeEach(() => {
  selectMaybeSingleMock.mockReset();
  updateMaybeSingleMock.mockReset();
});

describe('calculateDiscountedAmount', () => {
  it('applies a percentage discount', () => {
    expect(
      calculateDiscountedAmount(1000, { discount_type: 'percentage', discount_value: 10 }),
    ).toBe(900);
  });

  it('applies a fixed discount', () => {
    expect(calculateDiscountedAmount(1000, { discount_type: 'fixed', discount_value: 300 })).toBe(
      700,
    );
  });

  it('never drops the amount below 1', () => {
    expect(calculateDiscountedAmount(100, { discount_type: 'fixed', discount_value: 500 })).toBe(1);
  });
});

describe('redeemCoupon', () => {
  it('returns not_found when the code does not exist', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: null });

    const result = await redeemCoupon('MISSING', 1000);

    expect(result).toEqual({ outcome: 'not_found' });
  });

  it('returns inactive when the coupon is disabled', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: buildCoupon({ is_active: false }) });

    const result = await redeemCoupon('WELCOME10', 1000);

    expect(result).toEqual({ outcome: 'inactive' });
  });

  it('returns expired when past the expiry date', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({
      data: buildCoupon({ expires_at: '2020-01-01T00:00:00.000Z' }),
    });

    const result = await redeemCoupon('WELCOME10', 1000);

    expect(result).toEqual({ outcome: 'expired' });
  });

  it('returns usage_limit_reached when max uses is hit', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({
      data: buildCoupon({ max_uses: 5, used_count: 5 }),
    });

    const result = await redeemCoupon('WELCOME10', 1000);

    expect(result).toEqual({ outcome: 'usage_limit_reached' });
  });

  it('returns conflict when the conditional update loses a race', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: buildCoupon() });
    updateMaybeSingleMock.mockResolvedValueOnce({ data: null });

    const result = await redeemCoupon('WELCOME10', 1000);

    expect(result).toEqual({ outcome: 'conflict' });
  });

  it('redeems successfully and returns the discounted amount', async () => {
    selectMaybeSingleMock.mockResolvedValueOnce({ data: buildCoupon() });
    updateMaybeSingleMock.mockResolvedValueOnce({ data: buildCoupon({ used_count: 1 }) });

    const result = await redeemCoupon('WELCOME10', 1000);

    expect(result.outcome).toBe('redeemed');
    if (result.outcome === 'redeemed') {
      expect(result.discountedAmount).toBe(900);
    }
  });
});

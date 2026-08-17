import { describe, expect, it } from 'vitest';

import { SHIPPING } from '@/constants/pricing';
import { calculateShippingFee } from '@/lib/orders/calculate-shipping-fee';

describe('calculateShippingFee', () => {
  it('charges the base fee for a non-Jeju address under the free threshold', () => {
    expect(calculateShippingFee('06236', 1000)).toBe(SHIPPING.BASE_FEE_KRW);
  });

  it('adds the Jeju surcharge for postal codes starting with 63', () => {
    expect(calculateShippingFee('63133', 1000)).toBe(
      SHIPPING.BASE_FEE_KRW + SHIPPING.JEJU_SURCHARGE_KRW,
    );
  });

  it('is free once the subtotal reaches the free shipping threshold, even for Jeju', () => {
    expect(calculateShippingFee('63133', SHIPPING.FREE_SHIPPING_THRESHOLD_KRW)).toBe(0);
    expect(calculateShippingFee('06236', SHIPPING.FREE_SHIPPING_THRESHOLD_KRW + 1)).toBe(0);
  });

  it('is free exactly at the threshold boundary', () => {
    expect(calculateShippingFee('06236', SHIPPING.FREE_SHIPPING_THRESHOLD_KRW)).toBe(0);
    expect(calculateShippingFee('06236', SHIPPING.FREE_SHIPPING_THRESHOLD_KRW - 1)).toBe(
      SHIPPING.BASE_FEE_KRW,
    );
  });
});

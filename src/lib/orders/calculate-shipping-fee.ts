import { SHIPPING } from '@/constants/pricing';

const JEJU_POSTAL_CODE_PREFIX = '63';

export function calculateShippingFee(postalCode: string, subtotal: number): number {
  if (subtotal >= SHIPPING.FREE_SHIPPING_THRESHOLD_KRW) {
    return 0;
  }

  const surcharge = postalCode.startsWith(JEJU_POSTAL_CODE_PREFIX)
    ? SHIPPING.JEJU_SURCHARGE_KRW
    : 0;
  return SHIPPING.BASE_FEE_KRW + surcharge;
}

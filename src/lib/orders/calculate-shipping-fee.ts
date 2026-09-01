import {
  JEJU_POSTAL_CODE_PREFIX,
  REMOTE_AREA_POSTAL_PREFIXES,
  SHIPPING,
} from '@/constants/pricing';

export function calculateShippingFee(postalCode: string, subtotal: number): number {
  if (subtotal >= SHIPPING.FREE_SHIPPING_THRESHOLD_KRW) {
    return 0;
  }

  return SHIPPING.BASE_FEE_KRW + resolveAreaSurcharge(postalCode);
}

function resolveAreaSurcharge(postalCode: string): number {
  if (postalCode.startsWith(JEJU_POSTAL_CODE_PREFIX)) {
    return SHIPPING.JEJU_SURCHARGE_KRW;
  }

  if (REMOTE_AREA_POSTAL_PREFIXES.some((prefix) => postalCode.startsWith(prefix))) {
    return SHIPPING.REMOTE_AREA_SURCHARGE_KRW;
  }

  return 0;
}

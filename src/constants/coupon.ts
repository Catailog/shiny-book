export const DISCOUNT_TYPE = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
} as const;

export type DiscountType = (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];

const DISCOUNT_TYPE_VALUES: readonly DiscountType[] = Object.values(DISCOUNT_TYPE);

export function isDiscountType(value: string): value is DiscountType {
  return DISCOUNT_TYPE_VALUES.some((type) => type === value);
}

export const COUPON_CODE_MAX_LENGTH = 20;
export const COUPON_PERCENTAGE_MAX = 100;
export const COUPON_DISCOUNT_VALUE_MAX = 1_000_000;
export const COUPON_MAX_USES_MAX = 100_000;
export const ADMIN_COUPON_LIST_LIMIT = 500;
export const TEST_COUPON_CODE = 'TEST10';

export const DISCOUNT_TYPE = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
} as const;

export type DiscountType = (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];

const DISCOUNT_TYPE_VALUES: readonly DiscountType[] = Object.values(DISCOUNT_TYPE);

export function isDiscountType(value: string): value is DiscountType {
  return DISCOUNT_TYPE_VALUES.some((type) => type === value);
}

export const COUPON_CODE_MAX_LENGTH = 40;
export const COUPON_PERCENTAGE_MAX = 100;
export const ADMIN_COUPON_LIST_LIMIT = 50;

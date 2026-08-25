export const PRODUCT_CATEGORY = {
  CLASSIC: 'classic',
  PREMIUM: 'premium',
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];

const PRODUCT_CATEGORY_VALUES: readonly ProductCategory[] = Object.values(PRODUCT_CATEGORY);

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORY_VALUES.some((category) => category === value);
}

export const ADMIN_PRODUCT_LIST_LIMIT = 500;

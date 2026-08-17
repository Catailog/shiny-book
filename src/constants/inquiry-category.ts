export const INQUIRY_CATEGORY = {
  GENERAL: 'general',
  ORDER: 'order',
} as const;

export type InquiryCategory = (typeof INQUIRY_CATEGORY)[keyof typeof INQUIRY_CATEGORY];

const INQUIRY_CATEGORY_VALUES: readonly InquiryCategory[] = Object.values(INQUIRY_CATEGORY);

export function isInquiryCategory(value: string): value is InquiryCategory {
  return INQUIRY_CATEGORY_VALUES.some((category) => category === value);
}

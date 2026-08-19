export const INQUIRY_CATEGORY = {
  GENERAL: 'general',
  ORDER: 'order',
} as const;

export type InquiryCategory = (typeof INQUIRY_CATEGORY)[keyof typeof INQUIRY_CATEGORY];

export const INQUIRY_SEARCH_FIELD = {
  CUSTOMER_NAME: 'customerName',
  TITLE: 'title',
} as const;

export type InquirySearchField = (typeof INQUIRY_SEARCH_FIELD)[keyof typeof INQUIRY_SEARCH_FIELD];

const INQUIRY_SEARCH_FIELD_VALUES: readonly InquirySearchField[] =
  Object.values(INQUIRY_SEARCH_FIELD);

export function isInquirySearchField(value: string): value is InquirySearchField {
  return INQUIRY_SEARCH_FIELD_VALUES.some((field) => field === value);
}

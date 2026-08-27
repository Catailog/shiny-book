export const ORDER_SEARCH_FIELD = {
  TITLE: 'title',
  ID: 'id',
  CUSTOMER_NAME: 'customerName',
} as const;

export type OrderSearchField = (typeof ORDER_SEARCH_FIELD)[keyof typeof ORDER_SEARCH_FIELD];

const ORDER_SEARCH_FIELD_VALUES: readonly OrderSearchField[] = Object.values(ORDER_SEARCH_FIELD);

export function isOrderSearchField(value: string): value is OrderSearchField {
  return ORDER_SEARCH_FIELD_VALUES.some((field) => field === value);
}

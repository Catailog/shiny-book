export const ORDER_STATUS = {
  AWAITING_PAYMENT: 'awaiting_payment',
  PAID: 'paid',
  PRINTING: 'printing',
  BINDING: 'binding',
  SHIPPING: 'shipping',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

const ORDER_STATUS_VALUES: readonly OrderStatus[] = Object.values(ORDER_STATUS);

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUS_VALUES.some((status) => status === value);
}

export const ORDER_STATUS = {
  AWAITING_PAYMENT: 'awaiting_payment',
  PAID: 'paid',
  PRINTING: 'printing',
  BINDING: 'binding',
  SHIPPING: 'shipping',
  COMPLETED: 'completed',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

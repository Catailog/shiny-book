import { ORDER_STATUS, type OrderStatus } from '@/constants/order-status';

export const ORDER_STATUS_TONE = {
  [ORDER_STATUS.AWAITING_PAYMENT]: 'pending',
  [ORDER_STATUS.PAID]: 'in_progress',
  [ORDER_STATUS.PRINTING]: 'in_progress',
  [ORDER_STATUS.BINDING]: 'in_progress',
  [ORDER_STATUS.SHIPPING]: 'in_progress',
  [ORDER_STATUS.COMPLETED]: 'done',
} as const satisfies Record<OrderStatus, string>;

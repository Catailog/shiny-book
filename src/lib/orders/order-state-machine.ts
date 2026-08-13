import { ORDER_STATUS, type OrderStatus } from '@/constants/order-status';

const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  [ORDER_STATUS.AWAITING_PAYMENT]: [ORDER_STATUS.PAID],
  [ORDER_STATUS.PAID]: [ORDER_STATUS.PRINTING],
  [ORDER_STATUS.PRINTING]: [ORDER_STATUS.BINDING],
  [ORDER_STATUS.BINDING]: [ORDER_STATUS.SHIPPING],
  [ORDER_STATUS.SHIPPING]: [ORDER_STATUS.COMPLETED],
  [ORDER_STATUS.COMPLETED]: [],
};

export function getNextStatuses(from: OrderStatus): readonly OrderStatus[] {
  return ALLOWED_TRANSITIONS[from];
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

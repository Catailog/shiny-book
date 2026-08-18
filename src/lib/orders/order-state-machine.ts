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

const REVERT_TRANSITIONS: Record<OrderStatus, OrderStatus | null> = {
  [ORDER_STATUS.AWAITING_PAYMENT]: null,
  [ORDER_STATUS.PAID]: null,
  [ORDER_STATUS.PRINTING]: ORDER_STATUS.PAID,
  [ORDER_STATUS.BINDING]: ORDER_STATUS.PRINTING,
  [ORDER_STATUS.SHIPPING]: ORDER_STATUS.BINDING,
  [ORDER_STATUS.COMPLETED]: ORDER_STATUS.SHIPPING,
};

export function getPreviousStatus(from: OrderStatus): OrderStatus | null {
  return REVERT_TRANSITIONS[from];
}

export function canRevert(from: OrderStatus, to: OrderStatus): boolean {
  return REVERT_TRANSITIONS[from] === to;
}

import { ORDER_STATUS, type OrderStatus } from '@/constants/order-status';

export const REFUND_STATUS = {
  REQUESTED: 'requested',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type RefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS];

const REFUND_STATUS_VALUES: readonly RefundStatus[] = Object.values(REFUND_STATUS);

export function isRefundStatus(value: string): value is RefundStatus {
  return REFUND_STATUS_VALUES.some((status) => status === value);
}

// Order statuses a consumer may request a refund from (i.e. money has moved).
export const REFUNDABLE_ORDER_STATUSES: readonly OrderStatus[] = [
  ORDER_STATUS.PAID,
  ORDER_STATUS.PRINTING,
  ORDER_STATUS.BINDING,
  ORDER_STATUS.SHIPPING,
  ORDER_STATUS.COMPLETED,
];

export function isRefundableOrderStatus(status: OrderStatus): boolean {
  return REFUNDABLE_ORDER_STATUSES.some((candidate) => candidate === status);
}

export const REFUND_REASON_MAX_LENGTH = 500;
export const REFUND_REVIEW_NOTE_MAX_LENGTH = 500;

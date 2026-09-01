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

// Order statuses an admin may refund from (i.e. money has moved).
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

export const REFUND_NOTE_MAX_LENGTH = 500;

// Stored in refund_requests.reason when an admin refunds without a note. The
// admin refunds list maps this to a localized label.
export const ADMIN_INITIATED_REFUND_REASON = 'admin_initiated';

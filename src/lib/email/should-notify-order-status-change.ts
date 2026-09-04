import { ORDER_STATUS_NOTIFY_STATUSES } from '@/constants/email';
import { ORDER_STATUS, type OrderStatus } from '@/constants/order-status';

export interface OrderStatusTransition {
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  isRevert?: boolean;
}

export function shouldNotifyOrderStatusChange({
  fromStatus,
  toStatus,
  isRevert = false,
}: OrderStatusTransition): boolean {
  if (!ORDER_STATUS_NOTIFY_STATUSES.some((status) => status === toStatus)) {
    return false;
  }

  // A cancellation straight from `awaiting_payment` is an abandoned unpaid order
  // the consumer never committed to, so stay silent. A manual admin revert always
  // notifies regardless of where it came from.
  if (
    !isRevert &&
    toStatus === ORDER_STATUS.CANCELLED &&
    fromStatus === ORDER_STATUS.AWAITING_PAYMENT
  ) {
    return false;
  }

  return true;
}

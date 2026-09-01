'use server';

import { ORDER_EVENT_SOURCE } from '@/constants/order-event';
import { ORDER_STATUS } from '@/constants/order-status';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { transitionOrderStatus } from '@/lib/orders/transition-order-status';

export interface CancelConsumerOrderResult {
  errorCode: 'unauthorized' | 'order_not_cancellable';
}

export async function cancelConsumerOrder(
  orderId: string,
): Promise<CancelConsumerOrderResult | undefined> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const order = await getOrderById(orderId);
  if (!order || order.consumer_id !== consumer.id) {
    return { errorCode: 'unauthorized' };
  }

  const updated = await transitionOrderStatus(
    orderId,
    ORDER_STATUS.AWAITING_PAYMENT,
    ORDER_STATUS.CANCELLED,
    { source: ORDER_EVENT_SOURCE.CONSUMER, actor: consumer.id },
  );

  if (!updated) {
    return { errorCode: 'order_not_cancellable' };
  }

  return undefined;
}

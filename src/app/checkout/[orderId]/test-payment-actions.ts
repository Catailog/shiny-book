'use server';

import { redirect } from 'next/navigation';

import { ORDER_EVENT_SOURCE } from '@/constants/order-event';
import { ORDER_STATUS, isOrderStatus } from '@/constants/order-status';
import { env } from '@/env';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { transitionOrderStatus } from '@/lib/orders/transition-order-status';

const TEST_PAYMENT_KEY = 'test-payment';

export async function confirmTestPayment(orderId: string): Promise<{ success: false } | undefined> {
  if (!env.ALLOW_TEST_PAYMENT) {
    return { success: false };
  }

  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { success: false };
  }

  const order = await getOrderById(orderId);
  if (!order || order.consumer_id !== consumer.id || !isOrderStatus(order.status)) {
    return { success: false };
  }

  await transitionOrderStatus(orderId, order.status, ORDER_STATUS.PAID, {
    source: ORDER_EVENT_SOURCE.SYSTEM,
    actor: TEST_PAYMENT_KEY,
    metadata: { paymentKey: TEST_PAYMENT_KEY, amount: order.amount },
  });

  redirect(`/checkout/${orderId}/success?paymentKey=${TEST_PAYMENT_KEY}&amount=${order.amount}`);
}

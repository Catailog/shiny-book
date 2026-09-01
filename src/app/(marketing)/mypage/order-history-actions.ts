'use server';

import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getLocale } from '@/lib/i18n/get-locale';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { getOrderEvents } from '@/lib/orders/get-order-events';
import {
  type ConsumerOrderEventView,
  toConsumerOrderEventViews,
} from '@/lib/orders/order-event-timeline';
import { locales } from '@/locales';

export interface GetConsumerOrderHistoryResult {
  errorCode?: 'unauthorized';
  events?: ConsumerOrderEventView[];
}

export async function getConsumerOrderHistory(
  orderId: string,
): Promise<GetConsumerOrderHistoryResult> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const order = await getOrderById(orderId);
  if (!order || order.consumer_id !== consumer.id) {
    return { errorCode: 'unauthorized' };
  }

  const events = await getOrderEvents(orderId);
  const locale = await getLocale();
  return { events: toConsumerOrderEventViews(events, locales[locale]) };
}

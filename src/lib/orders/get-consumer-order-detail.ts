import 'server-only';

import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import type { Tables } from '@/lib/db/database.types';
import { getLocale } from '@/lib/i18n/get-locale';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { getOrderEvents } from '@/lib/orders/get-order-events';
import {
  type OrderPaymentSummary,
  getOrderPaymentSummary,
} from '@/lib/orders/get-order-payment-summary';
import { getShipmentJobByOrder } from '@/lib/orders/get-shipment-job-by-order';
import {
  type ConsumerOrderEventView,
  toConsumerOrderEventViews,
} from '@/lib/orders/order-event-timeline';
import { type ShipmentTrackingView, toShipmentTrackingView } from '@/lib/orders/shipment-tracking';
import {
  type OrderShippingAddressView,
  toOrderShippingAddressView,
} from '@/lib/orders/shipping-address-snapshot';
import { locales } from '@/locales';

export interface ConsumerOrderDetail {
  order: Tables<'orders'>;
  payment: OrderPaymentSummary | null;
  shippingAddress: OrderShippingAddressView | null;
  events: ConsumerOrderEventView[];
  shipment: ShipmentTrackingView | null;
}

// Assemble everything the consumer order detail page renders in one call:
// order row, payment breakdown, shipping snapshot, milestone timeline, and
// courier tracking. Returns null when the caller is not signed in or does not
// own the order, so the page can `notFound()`.
export async function getConsumerOrderDetail(orderId: string): Promise<ConsumerOrderDetail | null> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return null;
  }

  const order = await getOrderById(orderId);
  if (!order || order.consumer_id !== consumer.id) {
    return null;
  }

  const [events, shipmentJob, payment, locale] = await Promise.all([
    getOrderEvents(orderId),
    getShipmentJobByOrder(orderId),
    getOrderPaymentSummary(orderId),
    getLocale(),
  ]);

  return {
    order,
    payment,
    shippingAddress: toOrderShippingAddressView(order),
    events: toConsumerOrderEventViews(events, locales[locale]),
    shipment: shipmentJob ? toShipmentTrackingView(shipmentJob) : null,
  };
}

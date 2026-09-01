'use server';

import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { getOrderEvents } from '@/lib/orders/get-order-events';
import { type OrderEventView, toOrderEventView } from '@/lib/orders/order-event-timeline';
import {
  type OrderShippingAddressView,
  toOrderShippingAddressView,
} from '@/lib/orders/shipping-address-snapshot';
import { defaultLocale, locales } from '@/locales';

export interface GetOrderEventViewsResult {
  errorCode?: 'unauthorized';
  events?: OrderEventView[];
  shippingAddress?: OrderShippingAddressView | null;
}

export async function getOrderEventViews(orderId: string): Promise<GetOrderEventViewsResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const [events, order] = await Promise.all([getOrderEvents(orderId), getOrderById(orderId)]);
  const t = locales[defaultLocale];

  return {
    events: events.map((event) => toOrderEventView(event, t)),
    shippingAddress: order ? toOrderShippingAddressView(order) : null,
  };
}

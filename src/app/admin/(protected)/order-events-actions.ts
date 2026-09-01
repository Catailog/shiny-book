'use server';

import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { getOrderEvents } from '@/lib/orders/get-order-events';
import { type OrderEventView, toOrderEventView } from '@/lib/orders/order-event-timeline';
import { defaultLocale, locales } from '@/locales';

export interface GetOrderEventViewsResult {
  errorCode?: 'unauthorized';
  events?: OrderEventView[];
}

export async function getOrderEventViews(orderId: string): Promise<GetOrderEventViewsResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const events = await getOrderEvents(orderId);
  const t = locales[defaultLocale];
  return { events: events.map((event) => toOrderEventView(event, t)) };
}

import { ORDER_EVENT_TYPE, type OrderEventType, isOrderEventType } from '@/constants/order-event';
import { isOrderStatus } from '@/constants/order-status';
import type { Tables } from '@/lib/db/database.types';
import type { locales } from '@/locales';

type LocaleBundle = (typeof locales)[keyof typeof locales];

export interface OrderEventView {
  id: string;
  eventType: string;
  title: string;
  at: string;
  actor: string;
}

// Event types a consumer may see on their own order. Webhook receipts, admin
// notes, and notification records stay internal.
export const CONSUMER_VISIBLE_ORDER_EVENT_TYPES: readonly OrderEventType[] = [
  ORDER_EVENT_TYPE.ORDER_CREATED,
  ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED,
  ORDER_EVENT_TYPE.REFUND_COMPLETED,
];

export interface ConsumerOrderEventView {
  id: string;
  title: string;
  at: string;
}

// Turn a raw order_events row into a display model. A status change reads best
// as its target status label (already localized in `orderStatus`); everything
// else falls back to the `orderEvent` label for its type.
export function toOrderEventView(event: Tables<'order_events'>, t: LocaleBundle): OrderEventView {
  return {
    id: event.id,
    eventType: event.event_type,
    title: resolveTitle(event, t),
    at: event.created_at,
    actor: event.actor,
  };
}

// Consumer-facing timeline: only the milestone events, and without the internal
// `actor` field.
export function toConsumerOrderEventViews(
  events: Tables<'order_events'>[],
  t: LocaleBundle,
): ConsumerOrderEventView[] {
  return events
    .filter((event) => CONSUMER_VISIBLE_ORDER_EVENT_TYPES.some((type) => type === event.event_type))
    .map((event) => {
      const view = toOrderEventView(event, t);
      return { id: view.id, title: view.title, at: view.at };
    });
}

function resolveTitle(event: Tables<'order_events'>, t: LocaleBundle): string {
  if (
    event.event_type === ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED &&
    event.to_status !== null &&
    isOrderStatus(event.to_status)
  ) {
    return t.orderStatus[event.to_status];
  }

  if (isOrderEventType(event.event_type)) {
    return t.orderEvent[event.event_type];
  }

  return event.event_type;
}

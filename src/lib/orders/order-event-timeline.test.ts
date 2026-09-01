import { describe, expect, it } from 'vitest';

import { ORDER_EVENT_TYPE } from '@/constants/order-event';
import { ORDER_STATUS } from '@/constants/order-status';
import type { Tables } from '@/lib/db/database.types';
import { toConsumerOrderEventViews, toOrderEventView } from '@/lib/orders/order-event-timeline';
import { locales } from '@/locales';

function buildEvent(overrides: Partial<Tables<'order_events'>> = {}): Tables<'order_events'> {
  return {
    id: 'evt-1',
    order_id: 'order-1',
    event_type: ORDER_EVENT_TYPE.ORDER_CREATED,
    from_status: null,
    to_status: null,
    actor: 'system',
    source: 'system',
    reason: null,
    metadata: {},
    created_at: '2026-09-01T10:00:00.000Z',
    ...overrides,
  };
}

describe('toOrderEventView', () => {
  it('labels a status change with its target status', () => {
    const view = toOrderEventView(
      buildEvent({
        event_type: ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED,
        from_status: ORDER_STATUS.AWAITING_PAYMENT,
        to_status: ORDER_STATUS.PAID,
      }),
      locales.ko,
    );

    expect(view.title).toBe(locales.ko.orderStatus.paid);
    expect(view.at).toBe('2026-09-01T10:00:00.000Z');
  });

  it('labels a non-transition event from the orderEvent group', () => {
    expect(toOrderEventView(buildEvent(), locales.en).title).toBe(
      locales.en.orderEvent['order.created'],
    );
  });

  it('falls back to the raw event type when it is unknown', () => {
    expect(toOrderEventView(buildEvent({ event_type: 'order.exploded' }), locales.ko).title).toBe(
      'order.exploded',
    );
  });

  it('uses the orderEvent label when a status change has no target status', () => {
    const view = toOrderEventView(
      buildEvent({ event_type: ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED, to_status: null }),
      locales.ko,
    );

    expect(view.title).toBe(locales.ko.orderEvent['order.status_changed']);
  });
});

describe('toConsumerOrderEventViews', () => {
  it('keeps only milestone events and drops the actor field', () => {
    const views = toConsumerOrderEventViews(
      [
        buildEvent({ id: 'a', event_type: ORDER_EVENT_TYPE.ORDER_CREATED }),
        buildEvent({
          id: 'b',
          event_type: ORDER_EVENT_TYPE.WEBHOOK_RECEIVED,
          actor: 'webhook:toss',
        }),
        buildEvent({
          id: 'c',
          event_type: ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED,
          to_status: ORDER_STATUS.PAID,
        }),
        buildEvent({ id: 'd', event_type: ORDER_EVENT_TYPE.ADMIN_NOTE }),
      ],
      locales.ko,
    );

    expect(views.map((view) => view.id)).toEqual(['a', 'c']);
    expect(views[0]).not.toHaveProperty('actor');
    expect(views[1]?.title).toBe(locales.ko.orderStatus.paid);
  });
});

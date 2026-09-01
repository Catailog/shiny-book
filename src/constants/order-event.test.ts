import { describe, expect, it } from 'vitest';

import {
  ORDER_EVENT_SOURCE,
  ORDER_EVENT_TYPE,
  isOrderEventSource,
  isOrderEventType,
} from '@/constants/order-event';

describe('isOrderEventType', () => {
  it('accepts known event types', () => {
    expect(isOrderEventType(ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED)).toBe(true);
    expect(isOrderEventType('webhook.received')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isOrderEventType('order.exploded')).toBe(false);
    expect(isOrderEventType('')).toBe(false);
  });
});

describe('isOrderEventSource', () => {
  it('accepts known sources', () => {
    expect(isOrderEventSource(ORDER_EVENT_SOURCE.WEBHOOK)).toBe(true);
    expect(isOrderEventSource('admin')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isOrderEventSource('robot')).toBe(false);
  });
});

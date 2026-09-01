import { describe, expect, it } from 'vitest';

import { ORDER_EVENT_TYPE } from '@/constants/order-event';
import { parseOrderEventMetadata } from '@/schemas/order-event';

describe('parseOrderEventMetadata', () => {
  it('accepts a valid status-changed metadata', () => {
    expect(
      parseOrderEventMetadata(ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED, {
        paymentKey: 'pk_1',
        amount: 15000,
      }),
    ).toEqual({ paymentKey: 'pk_1', amount: 15000 });
  });

  it('treats null/undefined metadata as an empty object', () => {
    expect(parseOrderEventMetadata(ORDER_EVENT_TYPE.ADMIN_NOTE, null)).toEqual({});
    expect(parseOrderEventMetadata(ORDER_EVENT_TYPE.ADMIN_NOTE, undefined)).toEqual({});
  });

  it('strips unknown keys', () => {
    expect(
      parseOrderEventMetadata(ORDER_EVENT_TYPE.WEBHOOK_RECEIVED, {
        provider: 'toss',
        secret: 'leak',
      }),
    ).toEqual({ provider: 'toss' });
  });

  it('returns null when a required field is missing', () => {
    expect(parseOrderEventMetadata(ORDER_EVENT_TYPE.WEBHOOK_RECEIVED, {})).toBeNull();
  });

  it('returns null when a field has the wrong type', () => {
    expect(
      parseOrderEventMetadata(ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED, { amount: 'lots' }),
    ).toBeNull();
  });
});

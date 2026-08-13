import { describe, expect, it } from 'vitest';

import { parseTossPaymentWebhook } from '@/lib/webhooks/parse-toss-payment-webhook';

describe('parseTossPaymentWebhook', () => {
  it('parses a valid payment status changed event', () => {
    const result = parseTossPaymentWebhook({
      eventType: 'PAYMENT_STATUS_CHANGED',
      createdAt: '2022-01-01T00:00:00.000000',
      data: {
        paymentKey: 'payment-key-1',
        orderId: 'order-1',
        status: 'DONE',
      },
    });

    expect(result).toEqual({
      eventType: 'PAYMENT_STATUS_CHANGED',
      data: {
        paymentKey: 'payment-key-1',
        orderId: 'order-1',
        status: 'DONE',
      },
    });
  });

  it('returns null for a non-object body', () => {
    expect(parseTossPaymentWebhook('not an object')).toBeNull();
    expect(parseTossPaymentWebhook(null)).toBeNull();
  });

  it('returns null when data is missing', () => {
    expect(parseTossPaymentWebhook({ eventType: 'PAYMENT_STATUS_CHANGED' })).toBeNull();
  });

  it('returns null when a required data field is missing', () => {
    expect(
      parseTossPaymentWebhook({
        eventType: 'PAYMENT_STATUS_CHANGED',
        data: { paymentKey: 'payment-key-1', orderId: 'order-1' },
      }),
    ).toBeNull();
  });
});

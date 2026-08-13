import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/env', () => ({
  env: { TOSS_SECRET_KEY: 'test_sk_dummy' },
}));

const { confirmTossPayment } = await import('@/lib/payments/toss-confirm-payment');

function mockFetchResponse(ok: boolean, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      json: () => Promise.resolve(body),
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('confirmTossPayment', () => {
  it('confirms when the response status is DONE', async () => {
    mockFetchResponse(true, { status: 'DONE' });

    const result = await confirmTossPayment({
      paymentKey: 'payment-key',
      orderId: 'order-1',
      amount: 10000,
    });

    expect(result).toEqual({ isConfirmed: true });
  });

  it('fails when the response status is not DONE', async () => {
    mockFetchResponse(true, { status: 'IN_PROGRESS' });

    const result = await confirmTossPayment({
      paymentKey: 'payment-key',
      orderId: 'order-1',
      amount: 10000,
    });

    expect(result.isConfirmed).toBe(false);
  });

  it('fails with the provider message when the request is not ok', async () => {
    mockFetchResponse(false, { message: 'INVALID_REQUEST' });

    const result = await confirmTossPayment({
      paymentKey: 'payment-key',
      orderId: 'order-1',
      amount: 10000,
    });

    expect(result).toEqual({ isConfirmed: false, errorMessage: 'INVALID_REQUEST' });
  });

  it('fails safely when the response body is unexpected', async () => {
    mockFetchResponse(true, { unexpected: 'shape' });

    const result = await confirmTossPayment({
      paymentKey: 'payment-key',
      orderId: 'order-1',
      amount: 10000,
    });

    expect(result.isConfirmed).toBe(false);
  });
});

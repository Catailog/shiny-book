import { afterEach, describe, expect, it, vi } from 'vitest';

let mockAllowTestPayment = false;

vi.mock('@/env', () => ({
  env: {
    TOSS_SECRET_KEY: 'test_sk_dummy',
    get ALLOW_TEST_PAYMENT() {
      return mockAllowTestPayment;
    },
  },
}));

const { cancelTossPayment } = await import('@/lib/payments/toss-cancel-payment');

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
  mockAllowTestPayment = false;
});

describe('cancelTossPayment', () => {
  it('returns a mock success without calling the API when test payments are on', async () => {
    mockAllowTestPayment = true;
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const result = await cancelTossPayment({ paymentKey: 'pk_1', cancelReason: '변심' });

    expect(result.isCancelled).toBe(true);
    expect(result.isCancelled && result.transactionKey).toMatch(/^mock-cancel-/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('extracts the latest transaction key from a successful cancellation', async () => {
    mockFetchResponse(true, {
      cancels: [{ transactionKey: 'txn_old' }, { transactionKey: 'txn_new' }],
    });

    const result = await cancelTossPayment({
      paymentKey: 'pk_1',
      cancelReason: '파손',
      cancelAmount: 5000,
    });

    expect(result).toEqual({ isCancelled: true, transactionKey: 'txn_new' });
  });

  it('succeeds with a null transaction key when the response shape is unexpected', async () => {
    mockFetchResponse(true, { unexpected: true });

    const result = await cancelTossPayment({ paymentKey: 'pk_1', cancelReason: 'x' });

    expect(result).toEqual({ isCancelled: true, transactionKey: null });
  });

  it('returns the provider error message on a failed cancellation', async () => {
    mockFetchResponse(false, { message: '이미 취소된 결제입니다.' });

    const result = await cancelTossPayment({ paymentKey: 'pk_1', cancelReason: 'x' });

    expect(result).toEqual({ isCancelled: false, errorMessage: '이미 취소된 결제입니다.' });
  });
});

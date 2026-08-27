import { describe, expect, it, vi } from 'vitest';

const limitMock = vi.fn();

vi.mock('@/env', () => ({
  env: {
    KV_REST_API_URL: 'https://example.upstash.io',
    KV_REST_API_TOKEN: 'fake-token',
  },
}));

vi.mock('@upstash/redis', () => ({
  Redis: class {},
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: Object.assign(
    class {
      limit = limitMock;
    },
    { slidingWindow: vi.fn() },
  ),
}));

const { checkActionRateLimit } = await import('@/lib/rate-limit/action-rate-limit');

describe('checkActionRateLimit', () => {
  it('allows the request when under the limit', async () => {
    limitMock.mockResolvedValueOnce({ success: true, limit: 60, remaining: 59, reset: 1234567890 });

    const result = await checkActionRateLimit('user-1');

    expect(result).toEqual({ isAllowed: true, limit: 60, remaining: 59, resetAt: 1234567890 });
  });

  it('rejects the request when the limit is exceeded', async () => {
    limitMock.mockResolvedValueOnce({ success: false, limit: 60, remaining: 0, reset: 1234567890 });

    const result = await checkActionRateLimit('user-1');

    expect(result.isAllowed).toBe(false);
  });

  it('passes the key as the rate limit key', async () => {
    limitMock.mockResolvedValueOnce({ success: true, limit: 60, remaining: 59, reset: 0 });

    await checkActionRateLimit('user-42');

    expect(limitMock).toHaveBeenCalledWith('user-42');
  });
});

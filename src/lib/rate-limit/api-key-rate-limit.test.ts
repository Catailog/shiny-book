import { describe, expect, it, vi } from 'vitest';

const limitMock = vi.fn();

vi.mock('@/env', () => ({
  env: {
    UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
    UPSTASH_REDIS_REST_TOKEN: 'fake-token',
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

const { checkApiRateLimit } = await import('@/lib/rate-limit/api-key-rate-limit');

describe('checkApiRateLimit', () => {
  it('allows the request when under the limit', async () => {
    limitMock.mockResolvedValueOnce({
      success: true,
      limit: 60,
      remaining: 59,
      reset: 1234567890,
    });

    const result = await checkApiRateLimit('client-1');

    expect(result).toEqual({ isAllowed: true, limit: 60, remaining: 59, resetAt: 1234567890 });
  });

  it('rejects the request when the limit is exceeded', async () => {
    limitMock.mockResolvedValueOnce({
      success: false,
      limit: 60,
      remaining: 0,
      reset: 1234567890,
    });

    const result = await checkApiRateLimit('client-1');

    expect(result.isAllowed).toBe(false);
  });

  it('passes the client id as the rate limit key', async () => {
    limitMock.mockResolvedValueOnce({ success: true, limit: 60, remaining: 59, reset: 0 });

    await checkApiRateLimit('client-42');

    expect(limitMock).toHaveBeenCalledWith('client-42');
  });
});

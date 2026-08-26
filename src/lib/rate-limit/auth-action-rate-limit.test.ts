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

const { checkAuthActionRateLimit } = await import('@/lib/rate-limit/auth-action-rate-limit');

describe('checkAuthActionRateLimit', () => {
  it('allows the request when both keys are under the limit', async () => {
    limitMock
      .mockResolvedValueOnce({ success: true, limit: 5, remaining: 4, reset: 1234567890 })
      .mockResolvedValueOnce({ success: true, limit: 5, remaining: 3, reset: 1234567890 });

    const result = await checkAuthActionRateLimit('ip:1.2.3.4', 'email:user@example.com');

    expect(result).toEqual({ isAllowed: true, limit: 5, remaining: 4, resetAt: 1234567890 });
  });

  it('rejects the request when the primary key exceeds the limit', async () => {
    limitMock
      .mockResolvedValueOnce({ success: false, limit: 5, remaining: 0, reset: 1234567890 })
      .mockResolvedValueOnce({ success: true, limit: 5, remaining: 3, reset: 1234567890 });

    const result = await checkAuthActionRateLimit('ip:1.2.3.4', 'email:user@example.com');

    expect(result.isAllowed).toBe(false);
  });

  it('rejects the request when the secondary key exceeds the limit', async () => {
    limitMock
      .mockResolvedValueOnce({ success: true, limit: 5, remaining: 4, reset: 1234567890 })
      .mockResolvedValueOnce({ success: false, limit: 5, remaining: 0, reset: 1234567890 });

    const result = await checkAuthActionRateLimit('ip:1.2.3.4', 'email:user@example.com');

    expect(result.isAllowed).toBe(false);
  });

  it('checks both the primary and secondary keys', async () => {
    limitMock
      .mockResolvedValueOnce({ success: true, limit: 5, remaining: 4, reset: 0 })
      .mockResolvedValueOnce({ success: true, limit: 5, remaining: 4, reset: 0 });

    await checkAuthActionRateLimit('ip:1.2.3.4', 'email:user@example.com');

    expect(limitMock).toHaveBeenNthCalledWith(1, 'ip:1.2.3.4');
    expect(limitMock).toHaveBeenNthCalledWith(2, 'email:user@example.com');
  });
});

import { describe, expect, it, vi } from 'vitest';

const setMock = vi.fn();

vi.mock('@/lib/redis/create-redis-client', () => ({
  createRedisClient: () => ({
    set: setMock,
  }),
}));

const { markWebhookEventProcessed } = await import('@/lib/webhooks/check-webhook-idempotency');

describe('markWebhookEventProcessed', () => {
  it('returns true the first time an event id is seen', async () => {
    setMock.mockResolvedValueOnce('OK');

    const result = await markWebhookEventProcessed('event-1');

    expect(result).toBe(true);
  });

  it('returns false when the event id was already processed', async () => {
    setMock.mockResolvedValueOnce(null);

    const result = await markWebhookEventProcessed('event-1');

    expect(result).toBe(false);
  });

  it('sets the key with an nx guard and expiry', async () => {
    setMock.mockResolvedValueOnce('OK');

    await markWebhookEventProcessed('event-42');

    expect(setMock).toHaveBeenCalledWith(
      'webhook-event:event-42',
      '1',
      expect.objectContaining({ nx: true, ex: expect.any(Number) }),
    );
  });
});

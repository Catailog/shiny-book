import 'server-only';

import { createRedisClient } from '@/lib/redis/create-redis-client';

const IDEMPOTENCY_KEY_PREFIX = 'webhook-event';
const IDEMPOTENCY_TTL_SECONDS = 60 * 60 * 24;

export async function markWebhookEventProcessed(eventId: string): Promise<boolean> {
  const redis = createRedisClient();
  const result = await redis.set(`${IDEMPOTENCY_KEY_PREFIX}:${eventId}`, '1', {
    nx: true,
    ex: IDEMPOTENCY_TTL_SECONDS,
  });

  return result === 'OK';
}

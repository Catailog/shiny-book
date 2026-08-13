import { Redis } from '@upstash/redis';
import 'server-only';

import { env } from '@/env';

export function createRedisClient() {
  return new Redis({
    url: env.KV_REST_API_URL,
    token: env.KV_REST_API_TOKEN,
  });
}

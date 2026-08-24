import { cookies } from 'next/headers';

import 'server-only';

import { ORDER_CTA_SEEN_COOKIE_MAX_AGE, ORDER_CTA_SEEN_COOKIE_PREFIX } from '@/constants/consumer';
import { env } from '@/env';

export async function hasSeenOrderCta(consumerId: string): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(`${ORDER_CTA_SEEN_COOKIE_PREFIX}${consumerId}`);
}

export async function markOrderCtaSeen(consumerId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(`${ORDER_CTA_SEEN_COOKIE_PREFIX}${consumerId}`, '1', {
    maxAge: ORDER_CTA_SEEN_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
  });
}

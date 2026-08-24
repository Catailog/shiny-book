'use server';

import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { markOrderCtaSeen } from '@/lib/orders/order-cta-seen-cookie';

export async function markOrderCtaSeenAction(): Promise<void> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return;
  }

  await markOrderCtaSeen(consumer.id);
}

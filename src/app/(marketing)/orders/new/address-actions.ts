'use server';

import { getAddressesByConsumer } from '@/lib/addresses/get-addresses-by-consumer';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import type { Tables } from '@/lib/db/database.types';

export async function refreshAddresses(): Promise<Tables<'addresses'>[]> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return [];
  }

  return getAddressesByConsumer(consumer.id);
}

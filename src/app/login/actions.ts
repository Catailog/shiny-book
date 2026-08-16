'use server';

import { mockSignInConsumer } from '@/lib/mock/mock-session-actions';

export async function signInConsumer(): Promise<void> {
  await mockSignInConsumer();
}

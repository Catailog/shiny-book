'use server';

import { mockSignInAdmin } from '@/lib/mock/mock-session-actions';

export async function signInAdmin(): Promise<void> {
  await mockSignInAdmin();
}

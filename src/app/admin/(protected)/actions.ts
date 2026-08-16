'use server';

import { ADMIN_ROUTES } from '@/constants/routes';
import { mockSignOut } from '@/lib/mock/mock-session-actions';

export async function signOutAdmin(): Promise<void> {
  await mockSignOut(ADMIN_ROUTES.LOGIN);
}

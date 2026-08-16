import { cookies } from 'next/headers';

import 'server-only';

import { type Role, isRole } from '@/constants/roles';

export const MOCK_SESSION_COOKIE = 'mock_session_role';

export async function getMockSessionRole(): Promise<Role | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(MOCK_SESSION_COOKIE)?.value;
  return value && isRole(value) ? value : null;
}

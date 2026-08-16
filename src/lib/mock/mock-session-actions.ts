'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROLE } from '@/constants/roles';
import { ADMIN_ROUTES, CONSUMER_ROUTES } from '@/constants/routes';
import { MOCK_SESSION_COOKIE } from '@/lib/mock/mock-session';

const MOCK_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export async function mockSignInConsumer(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(MOCK_SESSION_COOKIE, ROLE.CONSUMER, {
    httpOnly: true,
    path: '/',
    maxAge: MOCK_SESSION_MAX_AGE_SECONDS,
  });
  redirect(CONSUMER_ROUTES.MYPAGE);
}

export async function mockSignInAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(MOCK_SESSION_COOKIE, ROLE.ADMIN, {
    httpOnly: true,
    path: '/',
    maxAge: MOCK_SESSION_MAX_AGE_SECONDS,
  });
  redirect(ADMIN_ROUTES.DASHBOARD);
}

export async function mockSignOut(redirectTo: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(MOCK_SESSION_COOKIE);
  redirect(redirectTo);
}

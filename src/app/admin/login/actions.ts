'use server';

import { redirect } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { TEST_ACCOUNT_ROLE_PREFIX } from '@/constants/test-account';
import { isAdminRole } from '@/lib/auth/is-admin-role';
import { createTestAccountPair } from '@/lib/auth/test-account-pair';
import {
  buildTestAccountEmail,
  persistTestAccountPairToken,
  readTestAccountPairToken,
  signInWithExistingTestAccount,
} from '@/lib/auth/test-account-session';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { verifyTurnstileToken } from '@/lib/turnstile/verify-turnstile-token';

import { type AdminLoginInput, adminLoginSchema } from './login-schema';

export interface AdminLoginActionResult {
  errorCode: 'invalid_credentials' | 'unexpected_error';
}

export async function signInAdmin(
  input: AdminLoginInput,
): Promise<AdminLoginActionResult | undefined> {
  const parsed = adminLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'invalid_credentials' };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { errorCode: 'invalid_credentials' };
  }

  if (!isAdminRole(data.user.app_metadata.role)) {
    await supabase.auth.signOut();
    return { errorCode: 'invalid_credentials' };
  }

  redirect(ADMIN_ROUTES.DASHBOARD);
}

export interface AdminTestLoginResult {
  errorCode: 'unavailable' | 'bot_verification_failed' | 'unexpected_error';
}

export async function signInTestAdmin(
  turnstileToken: string,
): Promise<AdminTestLoginResult | undefined> {
  const isHuman = await verifyTurnstileToken(turnstileToken);
  if (!isHuman) {
    return { errorCode: 'bot_verification_failed' };
  }

  const existingToken = await readTestAccountPairToken();

  if (existingToken) {
    const adminEmail = buildTestAccountEmail(TEST_ACCOUNT_ROLE_PREFIX.ADMIN, existingToken);

    if (await signInWithExistingTestAccount(adminEmail, isAdminRole)) {
      await persistTestAccountPairToken(existingToken);
      redirect(ADMIN_ROUTES.DASHBOARD);
    }
  }

  const pair = await createTestAccountPair();
  if (!pair) {
    return { errorCode: 'unexpected_error' };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: pair.adminEmail,
    password: pair.adminPassword,
  });

  if (error || !data.user || !isAdminRole(data.user.app_metadata.role)) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(ADMIN_ROUTES.DASHBOARD);
}

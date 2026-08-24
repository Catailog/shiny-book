'use server';

import { redirect } from 'next/navigation';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { TEST_ACCOUNT_ROLE_PREFIX } from '@/constants/test-account';
import { isAdminRole } from '@/lib/auth/is-admin-role';
import { isSafeRedirectPath } from '@/lib/auth/is-safe-redirect-path';
import { createTestAccountPair } from '@/lib/auth/test-account-pair';
import {
  buildTestAccountEmail,
  persistTestAccountPairToken,
  readTestAccountPairToken,
  signInWithExistingTestAccount,
} from '@/lib/auth/test-account-session';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

import { type ConsumerLoginInput, consumerLoginSchema } from './login-schema';

export interface ConsumerLoginActionResult {
  errorCode: 'invalid_credentials' | 'unexpected_error';
}

export async function signInConsumer(
  input: ConsumerLoginInput,
  redirectTo?: string,
): Promise<ConsumerLoginActionResult | undefined> {
  const parsed = consumerLoginSchema.safeParse(input);
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

  if (isAdminRole(data.user.app_metadata.role)) {
    await supabase.auth.signOut();
    return { errorCode: 'invalid_credentials' };
  }

  redirect(redirectTo && isSafeRedirectPath(redirectTo) ? redirectTo : CONSUMER_ROUTES.MYPAGE);
}

export interface ConsumerTestLoginResult {
  errorCode: 'unavailable' | 'unexpected_error';
}

function isConsumerRole(role: unknown): boolean {
  return !isAdminRole(role);
}

export async function signInTestConsumer(
  redirectTo?: string,
): Promise<ConsumerTestLoginResult | undefined> {
  const existingToken = await readTestAccountPairToken();

  if (existingToken) {
    const consumerEmail = buildTestAccountEmail(TEST_ACCOUNT_ROLE_PREFIX.CONSUMER, existingToken);

    if (await signInWithExistingTestAccount(consumerEmail, isConsumerRole)) {
      await persistTestAccountPairToken(existingToken);
      redirect(redirectTo && isSafeRedirectPath(redirectTo) ? redirectTo : CONSUMER_ROUTES.MYPAGE);
    }
  }

  const pair = await createTestAccountPair();
  if (!pair) {
    return { errorCode: 'unexpected_error' };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: pair.consumerEmail,
    password: pair.consumerPassword,
  });

  if (error || !data.user || isAdminRole(data.user.app_metadata.role)) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(redirectTo && isSafeRedirectPath(redirectTo) ? redirectTo : CONSUMER_ROUTES.MYPAGE);
}

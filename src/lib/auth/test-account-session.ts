import { cookies } from 'next/headers';

import { randomBytes } from 'node:crypto';
import 'server-only';

import { TEST_ACCOUNT } from '@/constants/test-account';
import { env } from '@/env';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export function generateTestAccountPairToken(): string {
  return randomBytes(3).toString('hex');
}

export function buildTestAccountEmail(rolePrefix: string, token: string): string {
  return `test-${rolePrefix}-${token}@${TEST_ACCOUNT.EMAIL_DOMAIN}`;
}

export function generateTestAccountPassword(): string {
  return randomBytes(24).toString('base64url');
}

function isTestAccountEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${TEST_ACCOUNT.EMAIL_DOMAIN}`);
}

export async function readTestAccountPairToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TEST_ACCOUNT.IDENTITY_COOKIE_NAME)?.value;
}

export async function persistTestAccountPairToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TEST_ACCOUNT.IDENTITY_COOKIE_NAME, token, {
    maxAge: TEST_ACCOUNT.IDENTITY_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
  });
}

export async function signInWithExistingTestAccount(
  email: string,
  isExpectedRole: (role: unknown) => boolean,
): Promise<boolean> {
  if (!isTestAccountEmail(email)) {
    return false;
  }

  const serviceClient = createServiceRoleClient();
  const { data: linkData, error: linkError } = await serviceClient.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (linkError || !linkData.user) {
    return false;
  }

  const isVerifiedTestAccount =
    linkData.user.app_metadata[TEST_ACCOUNT.IS_TEST_ACCOUNT_METADATA_KEY] === true &&
    isExpectedRole(linkData.user.app_metadata.role);

  if (!isVerifiedTestAccount) {
    return false;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });

  return Boolean(!error && data.user);
}

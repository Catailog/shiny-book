'use server';

import { redirect } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { isAdminRole } from '@/lib/auth/is-admin-role';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

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

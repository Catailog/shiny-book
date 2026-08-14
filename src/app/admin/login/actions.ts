'use server';

import { redirect } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { isAdminRole } from '@/lib/auth/is-admin-role';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

import { type AdminLoginInput, adminLoginSchema } from './login-schema';

export interface AdminLoginResult {
  errorCode: 'invalid_credentials' | 'unexpected_error';
}

export async function signInAdmin(input: AdminLoginInput): Promise<AdminLoginResult | undefined> {
  const parsed = adminLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'invalid_credentials' };
  }

  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error || !data.user) {
      return { errorCode: 'invalid_credentials' };
    }

    if (!isAdminRole(data.user.app_metadata.role)) {
      await supabase.auth.signOut();
      return { errorCode: 'invalid_credentials' };
    }
  } catch {
    return { errorCode: 'unexpected_error' };
  }

  redirect(ADMIN_ROUTES.DASHBOARD);
}

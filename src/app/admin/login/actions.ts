'use server';

import { redirect } from 'next/navigation';

import { ROLE } from '@/constants/roles';
import { ADMIN_ROUTES } from '@/constants/routes';
import { env } from '@/env';
import { isAdminRole } from '@/lib/auth/is-admin-role';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

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
  errorCode: 'unavailable' | 'unexpected_error';
}

export async function signInTestAdmin(): Promise<AdminTestLoginResult | undefined> {
  if (env.NODE_ENV === 'production') {
    return { errorCode: 'unavailable' };
  }

  const serviceClient = createServiceRoleClient();
  const { data: existingUsers, error: listError } = await serviceClient.auth.admin.listUsers();
  if (listError) {
    return { errorCode: 'unexpected_error' };
  }

  const existingTestAdmin = existingUsers.users.find((user) => user.email === env.ADMIN_SEED_EMAIL);

  if (!existingTestAdmin) {
    const { error: createError } = await serviceClient.auth.admin.createUser({
      email: env.ADMIN_SEED_EMAIL,
      password: env.ADMIN_SEED_PASSWORD,
      email_confirm: true,
      app_metadata: { role: ROLE.ADMIN },
    });

    if (createError) {
      return { errorCode: 'unexpected_error' };
    }
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: env.ADMIN_SEED_EMAIL,
    password: env.ADMIN_SEED_PASSWORD,
  });

  if (error || !data.user || !isAdminRole(data.user.app_metadata.role)) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(ADMIN_ROUTES.DASHBOARD);
}

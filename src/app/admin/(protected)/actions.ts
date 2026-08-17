'use server';

import { redirect } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

export async function signOutAdmin(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect(ADMIN_ROUTES.LOGIN);
}

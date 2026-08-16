'use server';

import { redirect } from 'next/navigation';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

export async function signOutConsumer() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect(CONSUMER_ROUTES.LOGIN);
}

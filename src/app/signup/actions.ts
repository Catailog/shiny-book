'use server';

import { redirect } from 'next/navigation';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

import { type ConsumerSignupInput, consumerSignupSchema } from './signup-schema';

export interface ConsumerSignupActionResult {
  errorCode: 'email_taken' | 'unexpected_error';
}

export async function signUpConsumer(
  input: ConsumerSignupInput,
): Promise<ConsumerSignupActionResult | undefined> {
  const parsed = consumerSignupSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'unexpected_error' };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { name: parsed.data.name } },
  });

  if (error) {
    if (error.code === 'user_already_exists') {
      return { errorCode: 'email_taken' };
    }
    return { errorCode: 'unexpected_error' };
  }

  if (!data.session) {
    return { errorCode: 'unexpected_error' };
  }

  redirect(CONSUMER_ROUTES.MYPAGE);
}

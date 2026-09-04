'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from '@/constants/locale';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import type { Locale } from '@/locales';

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });

  await persistLocaleToProfile(locale);

  revalidatePath('/', 'layout');
}

async function persistLocaleToProfile(locale: Locale) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    await supabase.auth.updateUser({ data: { locale } });
  } catch {
    // best-effort persistence; the locale cookie already drives the current request
    // and the next locale change retries the profile write
  }
}

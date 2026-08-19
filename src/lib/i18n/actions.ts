'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { LOCALE_COOKIE_MAX_AGE, LOCALE_COOKIE_NAME } from '@/constants/locale';
import type { Locale } from '@/locales';

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });
  revalidatePath('/', 'layout');
}

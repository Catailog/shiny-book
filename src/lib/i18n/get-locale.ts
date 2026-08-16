import { cookies, headers } from 'next/headers';

import 'server-only';

import { LOCALE_COOKIE_NAME } from '@/constants/locale';
import { type Locale, defaultLocale, locales } from '@/locales';

function isLocale(value: string): value is Locale {
  return value in locales;
}

function parsePreferredLocale(acceptLanguage: string): Locale | null {
  const entries = acceptLanguage.split(',');

  for (const entry of entries) {
    const tag = entry.split(';')[0]?.trim().toLowerCase() ?? '';
    const shortTag = tag.split('-')[0] ?? '';

    if (isLocale(shortTag)) {
      return shortTag;
    }
  }

  return null;
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  if (cookieValue && isLocale(cookieValue)) {
    return cookieValue;
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get('accept-language');
  const preferredLocale = acceptLanguage ? parsePreferredLocale(acceptLanguage) : null;

  return preferredLocale ?? defaultLocale;
}

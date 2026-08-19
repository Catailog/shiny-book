'use client';

import { LOCALE_COOKIE_NAME } from '@/constants/locale';
import { type Locale, defaultLocale, locales } from '@/locales';

function isLocale(value: string): value is Locale {
  return value in locales;
}

function readLocaleCookie(): Locale {
  if (typeof document === 'undefined') {
    return defaultLocale;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE_NAME}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1] ?? '') : '';

  return isLocale(value) ? value : defaultLocale;
}

export function useT() {
  return locales[readLocaleCookie()];
}

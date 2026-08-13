'use client';

import { defaultLocale, locales } from '@/locales';

// No locale switcher exists yet, so this always resolves to defaultLocale.
// Swapping in real locale detection later only requires changing this one function.
export function useT() {
  return locales[defaultLocale];
}

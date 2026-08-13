import type { ApiErrorCode } from '@/constants/api-errors';
import { type Locale, defaultLocale, locales } from '@/locales';

export function getApiErrorMessage(code: ApiErrorCode, locale: Locale = defaultLocale): string {
  return locales[locale].apiErrors[code];
}

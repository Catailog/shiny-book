import { isApiErrorCode } from '@/constants/api-errors';
import type { Locale, locales } from '@/locales';

type Dictionary = (typeof locales)[Locale];

// External endpoints (app/api/**) return an API_ERROR_CODES string, never a
// translated message. The client maps the code to a locale string here.
export function getApiErrorMessage(t: Dictionary, code: unknown): string {
  if (typeof code === 'string' && isApiErrorCode(code)) {
    return t.apiErrors[code];
  }
  return t.apiErrors.INTERNAL_ERROR;
}

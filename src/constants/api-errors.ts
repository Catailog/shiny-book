export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

const API_ERROR_CODE_VALUES: readonly ApiErrorCode[] = Object.values(API_ERROR_CODES);

export function isApiErrorCode(value: string): value is ApiErrorCode {
  return API_ERROR_CODE_VALUES.some((code) => code === value);
}

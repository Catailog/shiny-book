import type { ApiErrorCode } from '@/constants/api-errors';

export const en = {
  common: {
    loading: 'Loading...',
    error: 'Something went wrong.',
  },
  apiErrors: {
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'You do not have permission.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_FAILED: 'The input is invalid.',
    RATE_LIMITED: 'Too many requests. Please try again later.',
    INTERNAL_ERROR: 'Something went wrong. Please try again.',
  } satisfies Record<ApiErrorCode, string>,
} as const;

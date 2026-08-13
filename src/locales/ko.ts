import type { ApiErrorCode } from '@/constants/api-errors';

export const ko = {
  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다.',
  },
  apiErrors: {
    UNAUTHORIZED: '인증이 필요합니다.',
    FORBIDDEN: '권한이 없습니다.',
    NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
    VALIDATION_FAILED: '입력값이 올바르지 않습니다.',
    RATE_LIMITED: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    INTERNAL_ERROR: '일시적인 오류가 발생했습니다.',
  } satisfies Record<ApiErrorCode, string>,
} as const;

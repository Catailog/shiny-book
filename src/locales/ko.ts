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
  checkout: {
    title: '결제하기',
    quantitySuffix: '권',
    amountLabel: '결제 금액',
    payButton: '결제하기',
    payError: '결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.',
    alreadyProcessed: '이미 결제가 진행된 주문입니다.',
    success: {
      title: '결제 요청이 접수되었습니다',
      description: '결제 승인 처리는 다음 단계에서 이어집니다.',
      paymentKeyLabel: '결제 키',
      orderIdLabel: '주문 번호',
      amountLabel: '결제 금액',
    },
    fail: {
      title: '결제에 실패했습니다',
      codeLabel: '오류 코드',
      messageLabel: '오류 메시지',
    },
  },
} as const;

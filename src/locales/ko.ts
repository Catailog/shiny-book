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
    payCancelled: '결제를 취소하셨습니다.',
    alreadyProcessed: '이미 결제가 진행된 주문입니다.',
    orderIdLabel: '주문 번호',
    confirm: {
      confirmed: {
        title: '결제가 완료됐습니다',
        description: '주문이 결제완료 상태로 전환됐습니다.',
      },
      alreadyProcessed: {
        title: '이미 처리된 결제입니다',
        description: '이 주문은 이미 결제 처리가 완료됐습니다.',
      },
      amountMismatch: {
        title: '결제 금액이 일치하지 않습니다',
        description: '결제 승인을 진행할 수 없습니다. 고객센터에 문의해주세요.',
      },
      confirmFailed: {
        title: '결제 승인에 실패했습니다',
        description: '잠시 후 다시 시도하거나 고객센터에 문의해주세요.',
      },
      notFound: {
        title: '주문을 찾을 수 없습니다',
        description: '',
      },
      invalidRequest: {
        title: '잘못된 요청입니다',
        description: '',
      },
    },
    fail: {
      title: '결제에 실패했습니다',
      cancelledTitle: '결제를 취소하셨습니다',
      cancelledDescription: '결제 진행이 중단됐습니다. 다시 시도해주세요.',
      codeLabel: '오류 코드',
      messageLabel: '오류 메시지',
    },
  },
} as const;

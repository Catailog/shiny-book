import type { ApiErrorCode } from '@/constants/api-errors';
import type { OrderStatus } from '@/constants/order-status';

export const ko = {
  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다.',
  },
  orderStatus: {
    awaiting_payment: '결제대기',
    paid: '결제완료',
    printing: '인쇄중',
    binding: '제본중',
    shipping: '배송중',
    completed: '완료',
  } satisfies Record<OrderStatus, string>,
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
    needAgreement: '필수 약관에 동의해주세요.',
    alreadyProcessed: '이미 결제가 진행된 주문입니다.',
    orderIdLabel: '주문 번호',
    paymentErrors: {
      notSelectedPaymentMethod: '결제수단을 선택해주세요.',
      needCardPaymentDetail: '카드 결제 정보를 선택해주세요.',
      needRefundAccountDetail: '환불 계좌 정보를 입력해주세요.',
      exceedDepositAmountLimit:
        '가상계좌 입금 제한 금액을 초과했습니다. 다른 결제수단을 이용해주세요.',
      providerStatusUnhealthy:
        '결제 기관에 일시적인 오류가 발생했습니다. 다른 결제수단을 선택해주세요.',
      unsupportedTestPhasePaymentMethod: '테스트 환경에서는 지원하지 않는 결제수단입니다.',
      networkError: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      invalidMethodTransaction: '이미 처리 중인 요청이 있습니다. 잠시 후 다시 시도해주세요.',
    },
    testNotice: {
      title: '테스트 결제 환경입니다',
      body: '테스트 API 키로 연동돼 있어 실제 결제나 청구는 절대 발생하지 않습니다. 다만 결제 진행 과정 자체는 실제 결제와 완전히 동일하게 동작합니다. 아래 결제창에 뜨는 "테스트 환경이에요" 안내는 본 사이트가 아니라 토스페이먼츠가 직접 표시하는 문구이며, 인증 단계에서 주소창에 나타나는 payment-gateway-sandbox.tosspayments.com 같은 sandbox 도메인으로도 테스트 여부를 직접 확인하실 수 있습니다.',
    },
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
      abortedTitle: '결제 승인에 실패했습니다',
      abortedDescription: '결제 진행 중 승인에 실패했어요. 다시 시도해주세요.',
      rejectedTitle: '결제가 거절됐습니다',
      rejectedDescription: '카드사에서 결제를 거절했어요. 카드 정보나 한도를 확인해주세요.',
      codeLabel: '오류 코드',
      messageLabel: '오류 메시지',
    },
  },
  admin: {
    login: {
      title: '관리자 로그인',
      emailLabel: '이메일',
      passwordLabel: '비밀번호',
      submitButton: '로그인',
      submitting: '로그인 중...',
      errors: {
        emailInvalid: '올바른 이메일을 입력해주세요.',
        passwordRequired: '비밀번호를 입력해주세요.',
        invalid_credentials: '이메일 또는 비밀번호를 확인해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    dashboard: {
      title: '관리자 대시보드',
      signOutButton: '로그아웃',
    },
    orders: {
      title: '주문 목록',
      empty: '표시할 주문이 없습니다.',
      columns: {
        title: '도서명',
        quantity: '수량',
        amount: '결제 금액',
        status: '상태',
        createdAt: '주문일시',
        actions: '관리',
      },
      quantitySuffix: '권',
      advanceButton: '다음 단계로 진행',
      statusChangeErrors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        not_allowed: '허용되지 않는 상태 변경입니다.',
        conflict: '다른 곳에서 이미 상태가 변경됐습니다. 새로고침 후 다시 시도해주세요.',
      },
    },
  },
} as const;

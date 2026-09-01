import { ADDRESS_LABEL_MAX_LENGTH } from '@/constants/address';
import {
  ANNOUNCEMENT_CONTENT_MAX_LENGTH,
  ANNOUNCEMENT_TITLE_MAX_LENGTH,
} from '@/constants/announcement';
import type { AnnouncementCategory } from '@/constants/announcement-category';
import type { ApiErrorCode } from '@/constants/api-errors';
import {
  DISPLAY_NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/constants/auth';
import {
  COUPON_CODE_MAX_LENGTH,
  COUPON_DISCOUNT_VALUE_MAX,
  COUPON_PERCENTAGE_MAX,
} from '@/constants/coupon';
import { FAQ_ANSWER_MAX_LENGTH, FAQ_QUESTION_MAX_LENGTH } from '@/constants/faq';
import { INQUIRY_CONTENT_MAX_LENGTH, INQUIRY_TITLE_MAX_LENGTH } from '@/constants/inquiry';
import { ORDER_TITLE_MAX_LENGTH } from '@/constants/order';
import type { OrderEventType } from '@/constants/order-event';
import type { OrderStatus } from '@/constants/order-status';
import { PERSON_NAME_MAX_LENGTH } from '@/constants/person-name';
import {
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_PRICE_MAX,
  PRODUCT_SIZE_MAX_LENGTH,
  PRODUCT_SLUG_MAX_LENGTH,
} from '@/constants/product';

export const ko = {
  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다.',
    coachmarkClose: '닫기',
    turnstilePendingTooltip: '보안 인증 확인이 끝날 때까지 잠시 기다려주세요.',
    searchLabel: '검색',
    warning: '경고',
    importantToastLabel: '중요',
  },
  site: {
    nav: {
      products: '제품',
      gallery: '갤러리',
      pricing: '가격',
      about: '소개',
      atelier: '아틀리에',
      notices: '공지사항',
      faq: 'FAQ',
      reviews: '후기',
      studioGroup: '스튜디오',
      productionGroup: '제작 안내',
      supportGroup: '고객센터',
      login: '로그인',
      signup: '회원가입',
      mypage: '마이페이지',
      logout: '로그아웃',
      startOrder: '주문 시작하기',
      changeLanguage: '언어 변경',
      switchToLightMode: '라이트 모드로 전환',
      switchToDarkMode: '다크 모드로 전환',
      goToAdmin: '관리자 페이지 가기',
      goToAdminTooltip: '관리자 페이지 가기 - 테스트를 위해 추가된 버튼입니다.',
      openMenu: '메뉴 열기',
      menuTitle: '사이트 메뉴',
      coachmarkTestFeaturesTitle: '테스트 기능',
      coachmarkTestFeaturesDescription:
        '회원가입 없이 테스트 로그인을 할 수 있고, 관리자 페이지도 둘러볼 수 있어요.',
    },
    footer: {
      productsTitle: '제품',
      customerServiceTitle: '고객지원',
      companyTitle: '회사',
      inquiries: '1:1 문의',
      terms: '이용약관',
      privacy: '개인정보처리방침',
      businessInfo:
        '대표: 홍길동\n사업자등록번호: 000-00-00000\n통신판매업 신고번호: 제2026-서울중구-0000호\n서울특별시 중구 세종대로 110\n02-0000-0000\nexample@example.com',
      copyright: '© 2026 Shiny Book',
      links: {
        viewProducts: '제품 보기',
        layoutGuidelines: '레이아웃 가이드',
        ecoPapers: '친환경 용지',
        shippingPolicy: '배송 정책',
        ourStory: '브랜드 스토리',
        atelier: '아틀리에 소개',
        sustainability: '지속가능성',
        press: '보도자료 문의',
      },
    },
    home: {
      hero: {
        eyebrow: '맞춤 도서 인쇄 및 제작',
        title: '당신의 이야기를, 한 권의 책으로',
        description:
          '소중한 순간들을 바래지 않는 가치로 보존하세요. Shiny Book은 정성껏 고른 고급 용지와 견고한 제본 기술로 단 하나뿐인 나만의 책을 만들어드립니다.',
        primaryCtaLabel: '내 책 만들기',
        secondaryCtaLabel: '상품 보기',
        coachmarkNewOrderTitle: '이제 주문할 수 있어요',
        coachmarkNewOrderDescription: '여기를 눌러 나만의 책 만들기를 시작해보세요.',
        stats: [
          { label: '고급 용지 사용률', suffix: '%' },
          { label: '프리미엄 상품 종류', suffix: '개' },
          { label: '누적 판매 부수', suffix: '권' },
        ],
      },
      steps: {
        eyebrow: '제작 과정',
        title: '생각보다 쉬운 프리미엄 책 만들기',
        items: [
          {
            title: '사진 업로드',
            description:
              '추억이 담긴 고화질 사진들을 업로드하세요. 모바일과 데스크톱 어디서든 안전하게 전송됩니다.',
          },
          {
            title: '레이아웃 & 커버 선택',
            description:
              '스튜디오 디자이너가 정교하게 설계한 클래식 템플릿과 고급 린넨/가죽 커버 패브릭을 매칭합니다.',
          },
          {
            title: '단락 제본 및 수령',
            description:
              '전문 제본 장인의 섬세한 마감을 거쳐 맞춤 상자에 안전하게 포장된 완성본을 집에서 만나보세요.',
          },
        ],
      },
      features: {
        eyebrow: '품질 약속',
        title: '타협 없는 퀄리티와 집요한 마감',
        subtitle: '작은 디테일까지 신경 쓴 인쇄와 제본으로 완성도 높은 책을 만들어드립니다.',
        items: [
          {
            title: '무독성 아카이빙 페이퍼',
            description:
              '시간이 흘러도 변색되거나 손상되지 않는 아카이브 보존용 파인아트지를 엄선하여 사용합니다.',
          },
          {
            title: '수제 사철실 양장 제본',
            description:
              '쉽게 낱장이 떨어지지 않고, 시원하게 펼쳐지는 정통 수공예 하드커버 바인딩 기술을 적용합니다.',
          },
          {
            title: '감각적인 맞춤 편집',
            description:
              '여백의 미를 극대화한 클래식 잡지 스타일부터 밀도 높은 컬렉션까지, 다양한 디자인 템플릿을 지원합니다.',
          },
          {
            title: '맞춤형 친환경 패키징',
            description:
              '제작 완료 후, 외부 충격과 오염으로부터 책을 안전하게 보호하는 전용 패키지에 담아 신속히 배송됩니다.',
          },
        ],
      },
      products: {
        eyebrow: '컬렉션',
        title: 'Shiny Book 제품군',
        ctaLabel: '주문 시작하기',
        startingFromLabel: '시작가',
        filterLabel: '제품 필터',
        filters: {
          all: '전체 보기',
          classic: '기본 시리즈',
          premium: '프리미엄 시리즈',
        },
        items: [
          {
            name: '하드커버 포토북',
            size: '10 x 10 in',
            description:
              '견고한 보드 커버와 정밀한 마감으로 오래도록 보관하기 좋은 클래식한 하드커버 북입니다.',
            price: '990원',
          },
          {
            name: '소프트커버 포토북',
            size: '8 x 10 in',
            description:
              '가볍고 부드러운 커버로 제작해 매일 편하게 넘겨보기 좋은 데일리 기록용 북입니다.',
            price: '790원',
          },
          {
            name: '프리미엄 포토 앨범',
            size: '12 x 12 in',
            description:
              '고급 레더 커버와 두툼한 보존용 용지로 완성하는 가장 특별한 소장용 앨범입니다.',
            price: '9,900원',
          },
          {
            name: '여행 저널',
            size: '6 x 8 in',
            description:
              '휴대하기 좋은 아담한 사이즈로, 여행의 순간과 감상을 기록하기 좋은 저널입니다.',
            price: '690원',
          },
          {
            name: '웨딩 앨범',
            size: '11 x 14 in',
            description: '인생에서 가장 빛나는 순간을 우아하게 담아내는 웨딩 전용 앨범입니다.',
            price: '9,900원',
          },
          {
            name: '베이비 앨범',
            size: '9 x 9 in',
            description: '아기의 첫 1년, 소중한 성장 기록을 사랑스럽게 담아내는 앨범입니다.',
            price: '8,900원',
          },
        ],
      },
      notices: {
        title: '공지사항',
        empty: '등록된 공지사항이 없습니다.',
        more: '더보기',
        expandLabel: '공지사항 목록 펼치기',
        prevPageLabel: '이전 페이지',
        nextPageLabel: '다음 페이지',
      },
      reviews: {
        eyebrow: '고객 이야기',
        title: '먼저 이야기를 남겨주신 분들',
        empty: '등록된 후기가 없습니다.',
        more: '모든 후기 보기',
        ratingLabel: '평점',
        purchasedLabel: '구매 상품',
      },
      cta: {
        eyebrow: '지금 바로 시작하기',
        title: '지금 나만의 포토북을 만들어보세요',
        description:
          '단 몇 분이면 사진 업로드와 편집을 모두 끝내고, 수공예 감성의 아름다운 인쇄본을 주문할 수 있습니다.',
        primaryLabel: '지금 바로 만들기',
        secondaryLabel: '문의하기',
      },
    },
  },
  notFound: {
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 페이지가 존재하지 않거나 이동됐습니다.',
    backToHome: '홈으로 돌아가기',
  },
  orderStatus: {
    awaiting_payment: '결제대기',
    paid: '결제완료',
    printing: '인쇄중',
    binding: '제본중',
    shipping: '배송중',
    completed: '완료',
    cancelled: '취소됨',
    refunded: '환불됨',
  } satisfies Record<OrderStatus, string>,
  orderEvent: {
    'order.created': '주문 생성',
    'order.status_changed': '상태 변경',
    'webhook.received': '외부 시스템 이벤트 수신',
    'notification.sent': '알림 발송',
    'admin.note': '관리자 메모',
    'refund.completed': '환불 완료',
  } satisfies Record<OrderEventType, string>,
  announcementCategories: {
    notice: '공지사항',
    event: '이벤트',
    winner: '당첨자 발표',
  } satisfies Record<AnnouncementCategory, string>,
  apiErrors: {
    UNAUTHORIZED: '인증이 필요합니다.',
    FORBIDDEN: '권한이 없습니다.',
    NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
    VALIDATION_FAILED: '입력값이 올바르지 않습니다.',
    RATE_LIMITED: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    INTERNAL_ERROR: '일시적인 오류가 발생했습니다.',
    AI_UNAVAILABLE: 'AI 응답을 생성하지 못했습니다.',
  } satisfies Record<ApiErrorCode, string>,
  ai: {
    triggerLabel: 'AI 어시스턴트',
    panelTitle: 'AI 어시스턴트',
    panelDescription: '제품, 제작, 배송, 가격 등 서비스에 대해 물어보세요.',
    greeting:
      '안녕하세요! Shiny Book에 대해 궁금한 점을 물어보세요. 제품, 제작 과정, 배송, 가격 정책을 안내해 드릴게요.',
    inputPlaceholder: '메시지를 입력하세요',
    sendLabel: '보내기',
    thinking: 'AI가 답변을 작성 중입니다',
    errorMessage: '답변을 생성하지 못했어요. 잠시 후 다시 시도해 주세요.',
    inquiryPrompt: '더 자세한 도움이 필요하신가요?',
    inquiryLink: '1:1 문의하기',
    disclaimer: 'AI 답변은 참고용이며 실제와 다를 수 있어요.',
    sourceFaq: '관련 FAQ',
    sourceNotice: '관련 공지',
    clearChat: '새 대화',
  },
  checkout: {
    title: '결제하기',
    backButton: '이전 단계로',
    cancelOrder: {
      button: '주문 취소',
      confirmTitle: '이 주문을 취소할까요?',
      confirmDescription: '취소하면 결제대기 상태에서 벗어나며, 다시 되돌릴 수 없습니다.',
      cancelButton: '닫기',
      confirmButton: '주문 취소',
      success: '주문이 취소됐습니다.',
      errors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        order_not_cancellable: '이미 처리된 주문이라 취소할 수 없습니다.',
      },
    },
    summaryTitle: '주문 요약',
    paymentTitle: '결제 방식',
    quantitySuffix: '권',
    amountLabel: '결제 금액',
    merchandiseAmountLabel: '상품 금액',
    shippingFeeLabel: '배송비',
    shippingAddressLabel: '배송지',
    coupon: {
      label: '쿠폰 코드',
      applyButton: '확인',
      applying: '확인 중...',
      applySuccess: '쿠폰이 적용됐습니다.',
      discountLabel: '쿠폰 할인',
      errors: {
        validation_failed: `쿠폰 코드는 ${COUPON_CODE_MAX_LENGTH}자 이하로 입력해주세요.`,
        not_found: '주문을 찾을 수 없습니다.',
        already_applied: '이미 쿠폰이 적용된 주문입니다.',
        coupon_invalid: '사용할 수 없는 쿠폰 코드입니다.',
        coupon_conflict: '다른 곳에서 먼저 사용된 쿠폰입니다. 다시 시도해주세요.',
        rate_limited: '쿠폰 적용 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    payButton: '결제하기',
    testPaymentButton: '자동 테스트 결제',
    testPaymentTooltip: '결제창을 거치지 않고 바로 결제완료 상태로 전환합니다.',
    coachmarkTestPaymentTitle: '테스트 결제',
    coachmarkTestPaymentDescription: '실제 결제 없이 바로 결제완료 상태로 바꿀 수 있어요.',
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
      darkThemeNote: '테스트 결제 위젯은 다크 테마가 적용되지 않습니다.',
    },
    confirm: {
      confirmed: {
        title: '결제가 완료됐습니다',
        description: '주문이 결제완료 상태로 전환됐습니다.',
      },
      amountMismatch: {
        title: '결제 금액이 일치하지 않습니다',
        description: '결제 승인을 진행할 수 없습니다. 고객센터에 문의해주세요.',
      },
      couponUnavailable: {
        title: '쿠폰을 더 이상 사용할 수 없습니다',
        description:
          '적용하신 쿠폰이 그 사이 만료되었거나 다른 주문에서 먼저 사용됐어요. 결제는 진행되지 않았습니다. 고객센터에 문의해주세요.',
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
    backToMypageButton: '마이페이지로 돌아가기',
  },
  admin: {
    portalLabel: '관리자 포털',
    notificationsLabel: '알림',
    notificationsEmptyLabel: '미답변 문의가 없습니다.',
    notificationsViewAllLabel: '전체 문의 보기',
    pagination: {
      pageSizeLabel: '페이지당 표시 개수',
      pageSizeOption: '{count}개씩',
    },
    nav: {
      dashboard: '대시보드',
      products: '상품 관리',
      orders: '주문 목록',
      coupons: '쿠폰 관리',
      announcements: '공지사항 관리',
      faqs: 'FAQ 관리',
      inquiries: '문의 관리',
      refunds: '환불 관리',
      logout: '로그아웃',
    },
    refunds: {
      title: '환불 내역',
      empty: '환불 내역이 없습니다.',
      fullAmountLabel: '전액',
      adminInitiatedLabel: '관리자 환불',
      table: {
        order: '주문',
        note: '메모',
        amount: '환불 금액',
        status: '상태',
        processedAt: '처리일',
      },
      status: {
        approved: '승인됨',
        completed: '완료',
        failed: '실패',
      },
      retry: {
        button: '재시도',
        success: '환불 처리를 다시 실행했습니다.',
        errors: {
          unauthorized: '권한이 없습니다.',
          not_found: '요청을 찾을 수 없습니다.',
          not_processable: '재시도할 수 없는 상태입니다.',
          process_failed: '결제 취소 처리에 실패했습니다.',
        },
      },
    },
    login: {
      title: '관리자 로그인',
      emailLabel: '이메일',
      passwordLabel: '비밀번호',
      submitButton: '로그인',
      submitting: '로그인 중...',
      testLoginButton: '테스트 계정 즉시 로그인',
      testLoginSubmitting: '로그인 중...',
      testLoginTooltip: '관리자 테스트를 위해 새 계정으로 자동 로그인 합니다.',
      coachmarkTestLoginTitle: '관리자 테스트 계정으로 즉시 로그인',
      coachmarkTestLoginDescription: '클릭 한 번으로 관리자 화면을 확인할 수 있어요.',
      errors: {
        emailInvalid: '올바른 이메일을 입력해주세요.',
        passwordRequired: '비밀번호를 입력해주세요.',
        invalid_credentials: '이메일 또는 비밀번호를 확인해주세요.',
        rate_limited: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      testLoginErrors: {
        unavailable: '지금은 사용할 수 없는 기능입니다.',
        bot_verification_failed:
          '정상적인 접근인지 확인하지 못했습니다. 잠시 후 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    dashboard: {
      title: '대시보드 개요',
      signOutButton: '로그아웃',
      kpi: {
        todayOrders: '오늘 주문',
        pendingProduction: '제작 대기중',
        revenueThisMonth: '이번 달 매출',
        activeCoupons: '활성 쿠폰',
        vsLastMonth: '전월 대비',
      },
      recentSubmissions: {
        title: '최근 주문',
        exportCsv: 'CSV 내보내기',
        viewAll: '전체보기',
        columns: {
          orderId: '주문번호',
          customer: '고객',
          product: '상품',
          status: '상태',
          files: '파일 (원고/표지)',
          date: '날짜',
          amount: '금액',
        },
        selected: '선택됨',
        viewManuscript: '원고 보기',
        viewCoverLayout: '표지 레이아웃 보기',
      },
    },
    orders: {
      title: '주문 목록',
      empty: '표시할 주문이 없습니다.',
      columns: {
        title: '도서명',
        customerName: '고객명',
        quantity: '수량',
        amount: '결제 금액',
        status: '상태',
        createdAt: '주문일시',
        files: '파일',
        actions: '관리',
      },
      quantitySuffix: '권',
      filterAllLabel: '전체',
      search: {
        placeholder: '검색어 입력',
        fieldOptions: {
          title: '도서명',
          id: '주문번호',
          customerName: '고객명',
        },
      },
      advanceButton: '다음 단계로 진행',
      revertButton: '이전 단계로',
      revertConfirmTitle: '이전 단계로 되돌릴까요?',
      revertConfirmDescription:
        '주문 상태를 이전 단계로 되돌립니다. 이미 진행된 작업이 있다면 실제 진행 상황과 어긋날 수 있으니 신중하게 진행해주세요.',
      revertConfirmButton: '이전 단계로 강행',
      revertCancelButton: '취소',
      viewPhotosButton: '업로드 사진',
      photosLoading: '불러오는 중...',
      photosEmpty: '업로드된 사진이 없습니다.',
      fileViewError: '파일을 불러오지 못했습니다.',
      viewEventsButton: '주문 이력',
      eventsLoading: '불러오는 중...',
      eventsEmpty: '기록된 이력이 없습니다.',
      eventViewError: '이력을 불러오지 못했습니다.',
      shippingAddressLabel: '배송지',
      refund: {
        button: '환불',
        dialogTitle: '주문 환불',
        remainingLabel: '환불 가능 금액:',
        amountLabel: '환불 금액 (선택)',
        amountHint: '비워두면 전액 환불',
        amountInvalid: '0보다 큰 정수를 입력해주세요.',
        amountTooLarge: '환불 가능 금액을 초과했습니다.',
        noteLabel: '메모 (선택)',
        cancel: '닫기',
        confirm: '환불 처리',
        submitting: '처리 중...',
        success: '환불을 처리했습니다.',
        errors: {
          unauthorized: '권한이 없습니다.',
          validation_failed: '입력값을 확인해주세요.',
          order_not_found: '주문을 찾을 수 없습니다.',
          not_refundable: '이 주문은 환불할 수 없는 상태입니다.',
          amount_exceeds_remaining: '환불 가능 금액을 초과했습니다.',
          process_failed: '결제 취소 처리에 실패했습니다. 환불 관리에서 재시도해주세요.',
          failed: '환불 처리에 실패했습니다.',
        },
      },
      statusChangeErrors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        not_allowed: '허용되지 않는 상태 변경입니다.',
        conflict: '다른 곳에서 이미 상태가 변경됐습니다. 새로고침 후 다시 시도해주세요.',
      },
    },
    coupons: {
      title: '쿠폰 관리',
      newTitle: '쿠폰 발급',
      issueButton: '발급하기',
      empty: '등록된 쿠폰이 없습니다.',
      createSuccess: '쿠폰이 발급됐습니다.',
      unlimited: '무제한',
      noExpiry: '기한 없음',
      activeLabel: '활성',
      inactiveLabel: '비활성',
      expiredLabel: '만료됨',
      scheduledLabel: '적용 예정',
      activateButton: '활성화',
      deactivateButton: '비활성화',
      form: {
        codeLabel: '쿠폰 코드',
        discountTypeLabel: '할인 유형',
        discountValueLabel: '할인 값',
        maxUsesLabel: '최대 사용 횟수',
        expiresAtLabel: '만료일',
        periodLabel: '적용 기간',
        periodPlaceholder: '시작일 - 만료일 선택',
        submitButton: '발급하기',
        submitting: '발급 중...',
      },
      discountTypeOptions: {
        fixed: '정액 할인',
        percentage: '정률 할인',
      },
      columns: {
        code: '코드',
        discount: '할인',
        usage: '사용 현황',
        expiresAt: '만료일',
        active: '상태',
        createdAt: '생성일시',
        actions: '관리',
      },
      list: {
        tabs: {
          all: '전체 쿠폰',
          activeOnly: '활성만',
          expired: '만료됨',
        },
        searchPlaceholder: '쿠폰 코드 검색...',
        createButton: '쿠폰 발급',
        table: {
          code: '쿠폰 코드',
          type: '유형',
          value: '값',
          minOrder: '최소 주문금액',
          usage: '사용 현황 / 한도',
          expiry: '만료일',
          status: '상태',
          actions: '관리',
        },
        typeLabels: {
          percentage: '정률 할인',
          fixed: '정액 할인',
        },
      },
      create: {
        specificationsTitle: '쿠폰 상세정보',
        codeLabel: '쿠폰 코드',
        autoGenerateButton: '자동 생성',
        typeLabel: '할인 유형',
        typeOptions: {
          percentage: '정률 할인 (%)',
          fixed: '정액 할인 (₩)',
        },
        valueLabel: '할인 값',
        minOrderLabel: '최소 주문금액',
        startDateLabel: '시작일',
        endDateLabel: '종료일',
        descriptionLabel: '내부 설명',
        backToList: '목록으로 돌아가기',
        cancelButton: '취소',
        submitButton: '쿠폰 발급',
        previewLabel: '실시간 미리보기',
        previewMinPurchase: '최소 구매금액',
        previewExpires: '만료일',
      },
      errors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        code_taken: '이미 존재하는 쿠폰 코드입니다.',
        expired: '만료된 쿠폰은 상태를 변경할 수 없습니다.',
        conflict: '다른 곳에서 이미 변경됐습니다. 새로고침 후 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        fields: {
          code: {
            required: '쿠폰 코드를 입력해주세요.',
            tooLong: `쿠폰 코드는 ${COUPON_CODE_MAX_LENGTH}자 이하로 입력해주세요.`,
          },
          discountValue: {
            required: '할인 값을 입력해주세요.',
            invalid: '할인 값을 숫자로 입력해주세요.',
            min: '할인 값은 1 이상이어야 합니다.',
            max: `할인 값은 ${COUPON_DISCOUNT_VALUE_MAX.toLocaleString('ko-KR')} 이하로 입력해주세요.`,
            custom: `정률 할인은 ${COUPON_PERCENTAGE_MAX}%를 넘을 수 없습니다.`,
          },
          period: '시작일은 만료일보다 앞선 날짜여야 합니다.',
        },
      },
    },
    announcements: {
      title: '공지사항 관리',
      newTitle: '공지사항 작성',
      editTitle: '공지사항 수정',
      empty: '등록된 공지사항이 없습니다.',
      editLink: '수정',
      writeButton: '글쓰기',
      saveSuccess: '저장됐습니다.',
      form: {
        titleLabel: '제목',
        categoryLabel: '카테고리',
        contentLabel: '내용',
        createButton: '등록하기',
        saveButton: '저장하기',
        submitting: '저장 중...',
      },
      columns: {
        category: '카테고리',
        title: '제목',
        createdAt: '작성일시',
        updatedAt: '수정일시',
        actions: '관리',
      },
      errors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        fields: {
          title: {
            required: '제목을 입력해주세요.',
            tooLong: `제목은 ${ANNOUNCEMENT_TITLE_MAX_LENGTH}자 이하로 입력해주세요.`,
          },
          content: {
            required: '내용을 입력해주세요.',
            tooLong: `내용은 ${ANNOUNCEMENT_CONTENT_MAX_LENGTH.toLocaleString('ko-KR')}자 이하로 입력해주세요.`,
          },
        },
      },
      list: {
        filterAllLabel: '전체',
        categoryTabs: {
          all: '전체 카테고리',
          service: '서비스',
          event: '이벤트',
          maintenance: '점검',
        },
        searchPlaceholder: '공지사항 검색...',
        createButton: '공지사항 작성',
        selectAll: '전체 선택',
        table: {
          category: '카테고리',
          title: '제목',
          author: '작성자',
          date: '작성일',
          status: '상태',
          views: '조회수',
        },
        statusLabels: {
          published: '게시됨',
          draft: '임시저장',
        },
      },
      create: {
        backToList: '목록으로 돌아가기',
        compositionTitle: '작성 영역',
        titleLabel: '공지 제목',
        categoryLabel: '카테고리',
        attachmentsLabel: '첨부파일',
        attachmentsHint: '파일을 드래그 앤 드롭하거나 찾아보기를 클릭하세요',
        pinLabel: '목록 상단에 고정',
        saveDraftButton: '임시저장',
        publishButton: '저장 후 즉시 게시',
        publishingOptionsTitle: '게시 옵션',
        publishImmediately: '즉시 게시',
        publishImmediatelyHint: '프론트엔드 화면에 바로 반영',
        schedulePublication: '예약 게시',
        schedulePublicationHint: '원하는 시점을 지정해 게시',
      },
    },
    faqs: {
      title: 'FAQ 관리',
      newTitle: 'FAQ 작성',
      editTitle: 'FAQ 수정',
      empty: '등록된 FAQ가 없습니다.',
      editLink: '수정',
      writeButton: '글쓰기',
      saveSuccess: '저장됐습니다.',
      form: {
        questionLabel: '질문',
        answerLabel: '답변',
        createButton: '등록하기',
        saveButton: '저장하기',
        submitting: '저장 중...',
      },
      columns: {
        question: '질문',
        createdAt: '작성일시',
        actions: '관리',
      },
      errors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        fields: {
          question: {
            required: '질문을 입력해주세요.',
            tooLong: `질문은 ${FAQ_QUESTION_MAX_LENGTH}자 이하로 입력해주세요.`,
          },
          answer: {
            required: '답변을 입력해주세요.',
            tooLong: `답변은 ${FAQ_ANSWER_MAX_LENGTH.toLocaleString('ko-KR')}자 이하로 입력해주세요.`,
          },
        },
      },
      list: {
        searchPlaceholder: '질문 검색...',
        allCategories: '전체 카테고리',
        allStatuses: '전체 상태',
        showingCount: '{shown}개 표시',
        table: {
          title: '질문 제목',
          category: '카테고리',
          displayOrder: '표시 순서',
          status: '상태',
          lastEdited: '최근 수정일',
          actions: '관리',
        },
      },
      create: {
        backToList: '목록으로 돌아가기',
        detailsTitle: 'FAQ 상세정보',
        categoryLabel: '카테고리',
        displayOrderLabel: '표시 순서',
        statusLabel: '상태',
        questionLabel: '질문',
        answerLabel: '답변',
        cancelButton: '취소',
        submitButton: 'FAQ 저장',
        previewTitle: '고객 화면 미리보기',
        helpfulQuestion: '이 답변이 도움이 되었나요?',
        yes: '예',
        no: '아니오',
      },
    },
    inquiries: {
      title: '문의 관리',
      empty: '등록된 문의가 없습니다.',
      columns: {
        title: '제목',
        consumer: '작성자',
        status: '상태',
        createdAt: '작성일시',
        actions: '관리',
      },
      statusPending: '답변 대기',
      statusAnswered: '답변 완료',
      newReplyBadge: '추가 문의',
      viewLink: '보기',
      answerButton: '답변 등록',
      answering: '등록 중...',
      answerSuccess: '답변이 등록됐습니다.',
      errors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        not_found: '해당 댓글을 찾을 수 없습니다.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      list: {
        filterAllLabel: '전체',
        unresolvedFilterLabel: '미답변',
        statusTabs: {
          all: '전체 문의',
          new: '신규',
          inProgress: '처리중',
          answered: '답변 완료',
          closed: '종료',
        },
        search: {
          placeholder: '검색어 입력',
          fieldOptions: {
            customerName: '고객명',
            title: '제목',
          },
        },
        table: {
          inquiryNo: '문의번호',
          customerName: '고객명',
          category: '카테고리',
          subject: '제목',
          status: '상태',
          receivedDate: '최초 접수일',
          lastMessageDate: '마지막 문의일',
        },
        deletedConsumerLabel: '탈퇴한 사용자',
      },
      detail: {
        backToList: '목록으로 돌아가기',
        clientProfileTitle: '고객 정보',
        membershipLabel: '가입 유형',
        totalSpentLabel: '총 주문액',
        openTicketsLabel: '대기 중인 티켓',
        contextTitle: '문의 내용',
        subjectLabel: '제목',
        attachmentsLabel: '고객 첨부파일',
        conversationTitle: '대화 내역',
        customerLabel: '고객',
        internalNoteLabel: '내부 메모',
        publicReplyTab: '공개 답변',
        internalNoteTab: '내부 메모',
        toLabel: '받는 사람',
        attachFileButton: '파일 첨부',
        closeInquiryButton: '문의 종료',
        sendReplyButton: '답변 전송',
        relatedOrderLabel: '관련 주문',
        relatedOrderQuantity: '수량',
        relatedOrderAmount: '결제 금액',
        relatedOrderDate: '주문일시',
        couponUsedLabel: '사용 쿠폰',
        couponNotUsedLabel: '쿠폰 미사용',
        threadLabel: '대화 내역',
        adminAuthorLabel: '관리자',
        consumerAuthorLabel: '고객',
        replyLabel: '답변 작성',
        replyPlaceholder: '답변 내용을 입력해주세요.',
        editButton: '수정',
        deleteButton: '삭제',
        editCancelButton: '취소',
        editSaveButton: '저장',
        deleteConfirmTitle: '댓글을 삭제할까요?',
        deleteConfirmDescription: '삭제한 댓글은 되돌릴 수 없습니다.',
        deleteCancelButton: '취소',
        deleteConfirmButton: '삭제',
      },
    },
    products: {
      title: '상품 관리',
      newTitle: '상품 추가',
      editTitle: '상품 수정',
      empty: '등록된 상품이 없습니다.',
      writeButton: '상품 추가',
      searchPlaceholder: '상품명 검색...',
      saveSuccess: '저장됐습니다.',
      backToList: '목록으로 돌아가기',
      form: {
        slugLabel: '슬러그 (URL 식별자)',
        sizeLabel: '사이즈',
        languageLabel: '언어',
        nameLabel: '상품명',
        descriptionLabel: '설명',
        fallbackNotice: '값을 비워두면 {fallbackLanguage}로 표시됩니다.',
        priceLabel: '가격 (원)',
        imageUrlLabel: '상품 이미지',
        imageUploadButton: '이미지 업로드',
        imageUploading: '업로드 중...',
        categoryLabel: '카테고리',
        isActiveLabel: '노출 활성화',
        createButton: '등록하기',
        saveButton: '저장하기',
        submitting: '저장 중...',
      },
      categoryOptions: {
        classic: '기본 시리즈',
        premium: '프리미엄 시리즈',
      },
      columns: {
        name: '상품명',
        category: '카테고리',
        price: '가격',
        status: '상태',
        createdAt: '등록일',
        actions: '관리',
      },
      statusLabels: {
        active: '노출중',
        inactive: '숨김',
      },
      filterTabs: {
        all: '전체',
        active: '노출중',
        inactive: '숨김',
      },
      showButton: '노출하기',
      hideButton: '숨기기',
      errors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        slug_taken: '이미 존재하는 슬러그입니다.',
        conflict: '다른 곳에서 이미 변경됐습니다. 새로고침 후 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        fields: {
          slug: {
            required: '슬러그를 입력해주세요.',
            tooLong: `슬러그는 ${PRODUCT_SLUG_MAX_LENGTH}자 이하로 입력해주세요.`,
            format: '슬러그는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.',
          },
          name: {
            required: '상품명을 입력해주세요.',
            tooLong: `상품명은 ${PRODUCT_NAME_MAX_LENGTH}자 이하로 입력해주세요.`,
          },
          size: {
            required: '사이즈를 입력해주세요.',
            tooLong: `사이즈는 ${PRODUCT_SIZE_MAX_LENGTH}자 이하로 입력해주세요.`,
          },
          description: {
            required: '상품 설명을 입력해주세요.',
            tooLong: `상품 설명은 ${PRODUCT_DESCRIPTION_MAX_LENGTH.toLocaleString('ko-KR')}자 이하로 입력해주세요.`,
          },
          price: {
            required: '가격을 입력해주세요.',
            invalid: '가격을 숫자로 입력해주세요.',
            min: '가격은 0원 이상이어야 합니다.',
            max: `가격은 ${PRODUCT_PRICE_MAX.toLocaleString('ko-KR')}원 이하로 입력해주세요.`,
          },
        },
      },
    },
  },
  consumer: {
    login: {
      title: '로그인',
      subtitle: '나만의 책 만들기를 이어가세요',
      quote: {
        text: '모든 좋은 책들을 읽는 것은 과거의 가장 훌륭한 사람들과 대화를 나누는 것과 같다.',
        author: '르네 데카르트',
      },
      emailLabel: '이메일',
      passwordLabel: '비밀번호',
      showPasswordLabel: '비밀번호 표시',
      hidePasswordLabel: '비밀번호 숨기기',
      submitButton: '로그인',
      submitting: '로그인 중...',
      testLoginButton: '테스트 계정 즉시 로그인',
      testLoginSubmitting: '로그인 중...',
      testLoginTooltip: '소비자 테스트를 위해 새 계정으로 자동 로그인 합니다.',
      coachmarkTestLoginTitle: '소비자 테스트 계정으로 즉시 로그인',
      coachmarkTestLoginDescription: '직접 회원가입 해서 테스트 할 수도 있어요.',
      signupPrompt: '아직 계정이 없으신가요?',
      signupLink: '회원가입',
      errors: {
        emailInvalid: '올바른 이메일을 입력해주세요.',
        passwordRequired: '비밀번호를 입력해주세요.',
        invalid_credentials: '이메일 또는 비밀번호를 확인해주세요.',
        rate_limited: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      testLoginErrors: {
        unavailable: '지금은 사용할 수 없는 기능입니다.',
        bot_verification_failed:
          '정상적인 접근인지 확인하지 못했습니다. 잠시 후 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    signup: {
      title: '시작하기',
      subtitle: '소중한 기억을 책으로 보존하는 스튜디오',
      nameLabel: 'Full Name (이름)',
      emailLabel: 'Email (이메일)',
      passwordLabel: 'Password (비밀번호)',
      passwordConfirmLabel: 'Confirm Password (비밀번호 확인)',
      phoneLabel: '전화번호 (선택)',
      agreeTermsLabel: 'Shiny Book 이용약관에 동의합니다. (필수)',
      agreePrivacyLabel: '개인정보 수집 및 이용에 동의합니다. (필수)',
      marketingEmailLabel: '이메일 마케팅 정보 수신에 동의합니다. (선택)',
      marketingSmsLabel: 'SMS 마케팅 정보 수신에 동의합니다. (선택)',
      submitButton: '계정 만들기',
      submitting: '가입 처리 중...',
      socialDividerLabel: '또는 소셜 로그인',
      googleButton: 'Google',
      appleButton: 'Apple',
      loginPrompt: '이미 계정이 있으신가요?',
      loginLink: '로그인',
      errors: {
        nameRequired: `이름은 1자 이상 ${PERSON_NAME_MAX_LENGTH}자 이하로 입력해주세요.`,
        emailInvalid: '올바른 이메일을 입력해주세요.',
        passwordTooShort: `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 ${PASSWORD_MAX_LENGTH}자 이하여야 합니다.`,
        passwordConfirmRequired: '비밀번호 확인을 입력해주세요.',
        passwordMismatch: '비밀번호가 일치하지 않습니다.',
        phoneInvalid: '올바른 휴대폰 번호를 입력해주세요.',
        agreeTermsRequired: '이용약관에 동의해주세요.',
        agreePrivacyRequired: '개인정보 수집 및 이용에 동의해주세요.',
        email_taken: '이미 가입된 이메일입니다.',
        bot_verification_failed:
          '정상적인 접근인지 확인하지 못했습니다. 잠시 후 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    mypage: {
      title: '마이 페이지',
      subtitle: '진행 중인 프로젝트와 주문 내역을 확인하세요.',
      sidebar: {
        orders: '내 주문',
        account: '계정 설정',
        inquiries: '1:1 문의',
      },
      stats: {
        completed: '전체 주문 완료',
        inProgress: '제작 및 배송 중',
        inquiries: '나의 1:1 문의',
        volumeSuffix: '권',
        countSuffix: '건',
      },
      recentOrdersTitle: '최근 주문 내역',
      orders: {
        title: '주문내역',
        empty: '아직 주문 내역이 없습니다.',
        columns: {
          title: '도서명',
          quantity: '수량',
          amount: '결제 금액',
          status: '상태',
          createdAt: '주문일시',
          actions: '관리',
          inquiry: '문의',
        },
        quantitySuffix: '권',
        reviewWriteLink: '후기 쓰기',
        reviewDoneLink: '후기 완료',
        inquiryLink: '문의하기',
        payLink: '결제하기',
        historyButton: '진행 이력',
        historyTitle: '주문 진행 이력',
        historyLoading: '불러오는 중...',
        historyEmpty: '기록된 이력이 없습니다.',
        historyError: '이력을 불러오지 못했습니다.',
        shippingAddressLabel: '배송지',
      },
    },
    account: {
      title: '계정 설정',
      currentPasswordLabel: '현재 비밀번호',
      passwordLabel: '새 비밀번호',
      passwordConfirmLabel: '새 비밀번호 확인',
      submitButton: '변경하기',
      submitting: '변경 중...',
      success: '비밀번호가 변경됐습니다.',
      errors: {
        currentPasswordRequired: '현재 비밀번호를 입력해주세요.',
        incorrect_current_password: '현재 비밀번호가 일치하지 않습니다.',
        passwordTooShort: `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 ${PASSWORD_MAX_LENGTH}자 이하여야 합니다.`,
        passwordConfirmRequired: '새 비밀번호 확인을 입력해주세요.',
        passwordMismatch: '비밀번호가 일치하지 않습니다.',
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      personalInfo: {
        title: '개인 정보',
        editLink: '수정',
        nameLabel: '이름',
        emailLabel: '이메일',
        phoneLabel: '연락처',
        editNameTitle: '이름 변경',
        editPhoneTitle: '연락처 변경',
        nameInvalid: `이름은 1자 이상 ${DISPLAY_NAME_MAX_LENGTH}자 이하여야 합니다.`,
        phoneInvalid: '올바른 연락처를 입력해주세요.',
        phonePlaceholder: '연락처를 비워두면 등록된 연락처가 삭제됩니다.',
        updateSuccess: '이름이 변경됐습니다.',
        phoneUpdateSuccess: '연락처가 변경됐습니다.',
      },
      profileImage: {
        changeButton: '이미지 변경',
        deleteButton: '삭제',
        uploading: '업로드 중...',
        deleting: '삭제 중...',
        updateSuccess: '프로필 이미지가 변경됐습니다.',
        deleteSuccess: '프로필 이미지가 삭제됐습니다.',
        errors: {
          unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
          validation_failed: '이미지 파일(PNG, JPG, WEBP, 5MB 이하)만 업로드할 수 있습니다.',
          unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        },
      },
      changePassword: {
        title: '비밀번호 변경',
        currentPasswordLabel: '현재 비밀번호',
        newPasswordLabel: '새 비밀번호',
        newPasswordConfirmLabel: '새 비밀번호 확인',
      },
      shippingAddress: {
        title: '배송지 관리',
        addButton: '+ 배송지 추가',
        editLink: '수정',
        deleteLink: '삭제',
        defaultLabel: '기본 배송지',
        empty: '등록된 배송지가 없습니다.',
        addTitle: '배송지 추가',
        editTitle: '배송지 수정',
        form: {
          labelLabel: '배송지 이름',
          recipientNameLabel: '수령인',
          phoneLabel: '연락처',
          postalCodeLabel: '우편번호',
          searchAddressButton: '주소 검색',
          addressLine1Label: '주소',
          addressLine2Label: '상세주소 (선택)',
          isDefaultLabel: '기본 배송지로 설정',
          submitButton: '저장',
          submitting: '저장 중...',
          cancelButton: '취소',
        },
        deleteConfirmTitle: '이 배송지를 삭제할까요?',
        deleteConfirmDescription: '삭제한 배송지는 복구할 수 없습니다.',
        errors: {
          unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
          validation_failed: '입력값을 다시 확인해주세요.',
          not_found: '배송지를 찾을 수 없습니다.',
          unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          fields: {
            label: {
              required: '배송지 이름을 입력해주세요.',
              tooLong: `배송지 이름은 ${ADDRESS_LABEL_MAX_LENGTH}자 이하로 입력해주세요.`,
            },
            recipientName: {
              required: '수령인을 입력해주세요.',
              tooLong: `수령인은 ${PERSON_NAME_MAX_LENGTH}자 이하로 입력해주세요.`,
            },
            phone: {
              required: '연락처를 입력해주세요.',
              tooShort: '올바른 연락처를 입력해주세요.',
              format: '올바른 연락처를 입력해주세요.',
            },
            postalCode: {
              required: '주소 검색으로 우편번호를 입력해주세요.',
            },
            addressLine1: {
              required: '주소 검색으로 주소를 입력해주세요.',
            },
          },
        },
      },
      notifications: {
        title: '알림 설정',
        emailMarketing: '이메일 마케팅 동의',
        smsUpdates: '제작/배송 현황 SMS 알림',
      },
      deleteAccount: {
        prompt: '더 이상 계정을 사용하지 않으시나요?',
        button: '회원 탈퇴하기',
        confirmTitle: '정말 탈퇴하시겠어요?',
        confirmDescription: '계정과 관련 정보가 영구적으로 삭제되며 되돌릴 수 없습니다.',
        confirmButton: '탈퇴하기',
        cancelButton: '취소',
        errors: {
          unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
          unexpected_error: '탈퇴 처리 중 문제가 발생했습니다. 고객센터로 문의해주세요.',
        },
      },
    },
    orderNew: {
      title: '새로운 프로젝트 의뢰',
      productLabel: '선택한 상품',
      titleLabel: '도서명',
      titlePlaceholder: '도서명을 입력해주세요',
      quantityLabel: '수량',
      pageCountLabel: '페이지 수',
      nextButton: '다음',
      editButton: '수정',
      photosLabel: '내지 사진',
      photosHint: '{count} / {required}장 업로드됨',
      photosRetryNotice: '{count}장 업로드에 실패했어요.',
      photosRateLimited: '업로드 시도가 너무 많아요. {seconds}초 후에 다시 시도할 수 있어요.',
      photosRetryButton: '다시 올리기',
      addPhotosButton: '사진 추가',
      removePhotoLabel: '사진 삭제',
      testUploadButton: '테스트 이미지 자동 업로드',
      testUploadTooltip: '다음 화면 테스트를 위해 자동으로 업로드 됩니다.',
      coachmarkTestUploadTitle: '테스트 이미지 업로드',
      coachmarkTestUploadDescription: '예시 이미지들이 자동으로 업로드 돼요.',
      couponLabel: '쿠폰 코드 (선택)',
      testCouponButton: '테스트 쿠폰 코드 입력',
      testCouponTooltip: '10% 할인 테스트 쿠폰 코드를 자동으로 입력합니다.',
      coachmarkTestCouponTitle: '테스트 쿠폰 입력',
      coachmarkTestCouponDescription: '사용 제한 없는 테스트 쿠폰이 자동으로 입력돼요.',
      couponLockedNote: '이미 적용된 쿠폰은 이 화면에서 변경할 수 없어요.',
      uploadingTooltip: '이미지 업로드 중에는 진행할 수 없어요.',
      submitting: '주문 생성 중...',
      status: {
        queued: '대기 중...',
        uploading: '업로드 중...',
        processing: '이미지 처리 중...',
        done: '업로드 완료',
        error: '업로드 실패',
      },
      summary: {
        title: '주문 요약',
        productLine: '{productName} ({pageCount}p) x{quantity}',
        pageCountLine: '페이지 수 ({pageCount}p)',
        shipping: '배송비',
        shippingFree: '무료',
        shippingUndetermined: '미정',
        amountPending: '수량 입력 후 표시',
        finalEstimate: '최종 예상 금액',
        payButton: '의뢰 및 결제하기',
      },
      errors: {
        titleRequired: '도서명을 입력해주세요.',
        titleTooLong: `도서명은 최대 ${ORDER_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`,
        titleInvalidChars: '도서명에 사용할 수 없는 문자가 포함되어 있습니다.',
        quantityInvalid: '수량은 1권 이상이어야 합니다.',
        quantityTooLarge: '수량은 최대 {max}권까지 주문 가능합니다.',
        pageCountInvalid: '페이지 수를 선택해주세요.',
        photoCountMismatch: '내지 사진을 정확한 장수만큼 업로드해주세요.',
        photoCountExceeded:
          '업로드된 사진 {count}장이 변경된 페이지 수의 필요 장수({required}장)를 초과했습니다. 사진을 정리하거나 페이지 수를 늘려주세요.',
        photosSkippedOverLimit:
          '{skipped}장은 최대 장수({required}장)를 넘어서 아직 업로드하지 않았어요. 페이지 수를 늘리거나 사진을 정리한 뒤 목록에서 다시 올려주세요.',
        addressRequired: '배송지를 선택해주세요.',
        couponTooLong: `쿠폰 코드는 ${COUPON_CODE_MAX_LENGTH}자 이하로 입력해주세요.`,
        uploadFailed: '파일 업로드에 실패했습니다. 다시 시도해주세요.',
        filesRequired: '내지 사진을 업로드해주세요.',
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        product_not_found: '상품을 찾을 수 없습니다.',
        address_not_found: '선택한 배송지를 찾을 수 없습니다. 다시 선택해주세요.',
        order_not_editable: '이미 처리된 주문이라 수정할 수 없습니다. 마이페이지에서 확인해주세요.',
        coupon_invalid: '사용할 수 없는 쿠폰 코드입니다.',
        coupon_conflict: '다른 곳에서 먼저 사용된 쿠폰입니다. 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      addressLabel: '배송지',
      addressEmpty: '등록된 배송지가 없습니다. 마이페이지에서 배송지를 먼저 등록해주세요.',
      addAddressLink: '배송지 추가하러 가기',
      manageAddressLink: '배송지 추가/수정',
      refreshAddressesButton: '새로고침',
    },
    inquiries: {
      title: '1:1 문의 내역',
      subtitle: '스튜디오 전문가와의 상담 질문 내역입니다.',
      newTitle: '1:1 문의 작성',
      newButton: '새로운 문의 작성',
      empty: '문의 내역이 없습니다.',
      statusPending: '답변 대기',
      statusAnswered: '답변 완료',
      backToList: '목록으로 돌아가기',
      threadLabel: '대화 내역',
      loadOlderMessages: '이전 대화 더 보기',
      loadingOlderMessages: '불러오는 중...',
      adminAuthorLabel: '담당자',
      consumerAuthorLabel: '나',
      couponUsedLabel: '사용 쿠폰',
      couponNotUsedLabel: '쿠폰 미사용',
      replyPlaceholder: '추가로 문의할 내용을 입력해주세요.',
      replyButton: '문의 등록',
      replying: '등록 중...',
      filterTabs: {
        all: '전체보기',
        answered: '답변 완료',
        pending: '접수 중',
      },
      table: {
        number: '번호',
        inquiryId: '문의 ID',
        orderTitle: '문의 도서',
        category: '분류',
        title: '제목',
        status: '상태',
        createdAt: '최초 접수일',
        lastMessageDate: '마지막 문의일',
      },
      form: {
        categoryLabel: '문의 카테고리',
        categoryOptions: {
          general: '일반 문의',
          order: '주문 문의',
        },
        relatedOrderLabel: '관련 주문 선택 (선택사항)',
        relatedOrderPlaceholder: '주문을 선택해주세요',
        relatedOrderLine: '관련 주문',
        titleLabel: '제목',
        titlePlaceholder: '문의할 핵심 내용을 적어주세요.',
        contentLabel: '내용',
        contentPlaceholder:
          '상세한 제작 질문사항이나 요청 정보를 자유롭게 작성해 주세요. 전문 편집 디자이너가 영업일 기준 24시간 내에 답변해 드립니다.',
        attachmentsLabel: '첨부파일 (최대 3개)',
        attachmentsHint: '참고 이미지가 있다면 함께 업로드해 주세요. (PNG, JPG, PDF 지원)',
        chooseFileButton: '파일 선택',
        cancelButton: '취소',
        submitButton: '작성 완료',
        submitting: '등록 중...',
      },
      errors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        not_found: '문의를 찾을 수 없습니다.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        fields: {
          title: {
            required: '제목을 입력해주세요.',
            tooLong: `제목은 ${INQUIRY_TITLE_MAX_LENGTH}자 이하로 입력해주세요.`,
          },
          content: {
            required: '내용을 입력해주세요.',
            tooLong: `내용은 ${INQUIRY_CONTENT_MAX_LENGTH.toLocaleString('ko-KR')}자 이하로 입력해주세요.`,
          },
        },
      },
    },
    reviews: {
      notCompleted: '완료된 주문만 후기를 작성할 수 있습니다.',
      ratingLabel: '평점',
      form: {
        ratingLabel: '평점',
        contentLabel: '후기 내용 (선택)',
        submitButton: '후기 등록',
        submitting: '등록 중...',
      },
      errors: {
        unauthorized: '권한이 없습니다.',
        not_completed: '완료된 주문만 후기를 작성할 수 있습니다.',
        already_reviewed: '이미 후기를 작성한 주문입니다.',
        validation_failed: '입력값을 다시 확인해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
  },
  notice: {
    list: {
      eyebrow: 'Archive & Bulletin',
      title: '공지사항',
      empty: '등록된 공지사항이 없습니다.',
      searchPlaceholder: '공지사항 검색',
      categoryTabs: {
        all: '전체',
      },
      table: {
        category: '분류',
        title: '제목',
        date: '작성일',
      },
    },
    detail: {
      backToList: '목록으로 돌아가기',
    },
  },
  faq: {
    hero: {
      eyebrow: '무엇을 도와드릴까요?',
      description:
        '고품격 아카이빙 서적을 만드시는 과정에서 발생할 수 있는 주요 의문 사항들을 정교하게 선별하여 정리했습니다. 추가 문의는 1:1 문의를 통해 남겨주세요.',
    },
    title: '자주 묻는 질문',
    empty: '등록된 FAQ가 없습니다.',
    inquiryCtaLabel: '1:1 문의하기',
  },
  products: {
    hero: {
      eyebrow: '아틀리에 컬렉션',
      title: '전체 컬렉션',
      description:
        'Shiny Book이 제안하는 소장 가치를 담은 프리미엄 도서 가이드입니다. 정통 사철 제본 기법과 엄선된 친환경 용지만을 사용합니다.',
    },
    resultsLabel: '{count}개 상품',
    viewDetails: '자세히 보기',
    detail: {
      notFoundTitle: '상품을 찾을 수 없습니다',
      backToList: '목록으로 돌아가기',
      ctaLabel: '내 책 만들기',
      specsEyebrow: '스펙',
      specsTitle: '수공예로 완성되는 품격 있는 명세',
      specs: [
        {
          title: '보존용 무산성지',
          description: '수십 년이 지나도 누렇게 바래지 않는 최고급 아카이브 전용지 적용.',
        },
        {
          title: '정통 수제 양장제본',
          description: '한 땀 한 땀 사철 바느질로 엮어 180도 완벽한 스프레드를 보장합니다.',
        },
        {
          title: '감각적인 여백 템플릿',
          description: '디자이너들의 조형적 황금비율 레이아웃 설계 템플릿 제공.',
        },
      ],
      relatedEyebrow: '추천 상품',
      relatedTitle: '당신의 일상에 조화를 더할 제품군',
    },
  },
  pricing: {
    hero: {
      eyebrow: '투명한 가격 정책',
      title: '가격 안내',
      description:
        '상품 기본 가격은 상품마다 다르며, 여기에 선택한 페이지 수만큼의 비용과 배송비가 더해집니다. 숨겨진 옵션 없이 아래 기준 그대로 계산됩니다.',
    },
    pagePricing: {
      title: '페이지 수에 따른 추가 비용',
      description:
        '상품 기본 가격은 상품마다 달라 상품 목록에서 확인할 수 있습니다. 여기에 선택한 페이지 수만큼 아래 비용이 더해집니다.',
      perPageLine: '페이지당 추가 비용',
      productLinkLabel: '상품별 기본 가격 보기',
    },
    shippingPricing: {
      title: '배송비 안내',
      tableHeaders: {
        item: '구분',
        amount: '금액',
      },
      baseFeeLine: '기본 배송비',
      jejuLine: '제주 지역 추가',
      remoteLine: '도서산간 지역 추가',
      freeThresholdLine: '{amount} 이상 구매 시',
      freeThresholdValue: '무료배송',
    },
    ctaLabel: '내 책 만들기',
  },
  gallery: {
    hero: {
      eyebrow: '보존된 기억들',
      title: 'Shiny Book 갤러리',
      description:
        'Shiny Book과 고객이 함께 완성한 한 권의 작품집들을 소개합니다. 실제 출간본의 레이아웃과 수제 제본 패브릭 마감을 직접 눈으로 확인해 보세요.',
    },
    filters: {
      all: '전체',
      wedding: '웨딩',
      travel: '여행',
      family: '가족',
      baby: '베이비',
      lifestyle: '라이프스타일',
    },
    items: [
      {
        image: '/images/gallery/forest-record.png',
        category: 'travel',
        title: '고요한 숲속의 기록',
        description:
          '북유럽의 깊은 침엽수림과 미니멀 인테리어를 린넨 샌드 커버에 은박 가공하여 기록한 포토북.',
      },
      {
        image: '/images/gallery/wedding-day.png',
        category: 'wedding',
        title: 'Our Classic Wedding Day',
        description:
          '우아한 이탈리아 실크 패브릭과 은박 인그레이빙으로 고풍스러운 성당 예식의 장엄함을 담았습니다.',
      },
      {
        image: '/images/gallery/first-steps.png',
        category: 'baby',
        title: '봄, 아기의 첫 발걸음',
        description:
          '아기의 솜털과 해맑은 웃음소리가 느껴지도록 포근한 파스텔 파인아트지에 섬세하게 출력한 앨범.',
      },
      {
        image: '/images/gallery/alps-hiking.png',
        category: 'travel',
        title: '알프스 하이킹 일지',
        description:
          '손에 쥐기 쉬운 클래식 저널 사이즈로 만년필 기록과 오렌지 브라운 레더 끈 제본이 멋스럽습니다.',
      },
      {
        image: '/images/gallery/three-generations.png',
        category: 'family',
        title: '가족의 시간, 삼대의 초상',
        description:
          '조부모님의 칠순을 맞아 제작된 장엄한 12인치 프리미엄 앨범. 가죽 커버 특유의 기품이 드러납니다.',
      },
      {
        image: '/images/gallery/afternoon-essay.png',
        category: 'lifestyle',
        title: '오후의 소박한 에세이',
        description:
          '매일 마시는 커피 한 잔, 창가의 햇빛 등 조용한 일상을 모던한 레이아웃으로 담백하게 구성.',
      },
    ],
  },
  about: {
    hero: {
      eyebrow: '우리의 이야기와 철학',
      title: '세상의 단 하나뿐인 역사, 영원히 흐려지지 않도록',
      description:
        '스마트폰 속에 묻혀 잊혀가는 수천 장의 사진들. 그 속에는 단순히 파일이 아니라 삶의 가장 빛나던 온도가 담겨 있습니다. 우리는 기술과 수공예 제본의 융합을 통해 디지털 데이터가 누릴 수 없는 만져지는 아날로그의 영속적인 기쁨을 선사하고자 설립되었습니다.',
    },
    values: {
      eyebrow: '우리가 지키는 가치',
      title: 'Shiny Book이 추구하는 세 가지 정수',
      items: [
        {
          title: '장인정신 (Craftsmanship)',
          description:
            '전문 서적 바인더 장인의 손길을 거칩니다. 풀칠 하나, 실 한 땀에도 타협 없는 완성도를 추구합니다.',
        },
        {
          title: '지속가능성 (Sustainability)',
          description:
            '100년이 흘러도 노랗게 변하지 않는 아카이브 전용 FSC 친환경 지류와 생분해성 코팅 원단만을 사용합니다.',
        },
        {
          title: '디테일의 미학 (Quality)',
          description:
            '여백의 완벽한 밸런스를 계산한 레이아웃 템플릿과 정밀 스펙 인쇄 기법으로 사진의 생동감을 온전히 보존합니다.',
        },
      ],
    },
    milestones: {
      title: '주요 연혁',
      items: [
        {
          year: '2018',
          title: '스튜디오 설립',
          description:
            '마포구 성산동의 소박한 제본실에서 장인 2인과 디지털 디자이너 1인이 전통 도서 출판을 목표로 시작했습니다.',
        },
        {
          year: '2020',
          title: 'FSC 친환경 지류 전면 교체',
          description:
            '지속 가능한 보존을 위한 FSC 인증 무독성 지류만을 엄선하여 고품격 아카이빙 서적을 시장에 공식 출시했습니다.',
        },
        {
          year: '2022',
          title: '이탈리아 풀그레인 레더 도입',
          description:
            '최고급 명품 브랜드에 사용되는 피렌체 친환경 태닝 가죽 마감을 정식 도입해 프리미엄 앨범 라인을 확장했습니다.',
        },
        {
          year: '2024',
          title: '10,000번째 추억 보존',
          description:
            '수많은 가구와 크리에이터들의 귀중한 개인 역사를 보존 서적으로 인쇄하여 가치를 전달하고 있습니다.',
        },
      ],
    },
    team: {
      title: '스튜디오 장정 팀',
      members: [
        {
          image: '/images/about/team-1.png',
          name: '장서영',
          role: 'Master Bookbinder (제본 장인)',
          description:
            '30년 경력의 수제 도서 장정 마스터. 사철 실꿰기 및 전통 가죽 제본을 총괄합니다.',
        },
        {
          image: '/images/about/team-2.png',
          name: '데이비드 김',
          role: 'Creative Director',
          description:
            '런던 센트럴 세인트 마틴 출신. Shiny Book만의 클래식 편집 템플릿을 설계했습니다.',
        },
        {
          image: '/images/about/team-3.png',
          name: '한지우',
          role: 'Chief Paper Curator',
          description: '전 세계의 친환경 고품질 지류를 감정하고, 인쇄 발색 상태를 정밀 제어합니다.',
        },
      ],
    },
  },
  atelier: {
    hero: {
      eyebrow: '북크래프트 워크숍 내부',
      title: '아틀리에',
      description:
        '오랜 세월 동안 전승되어 온 정통 수제 제본소의 깊은 침묵과 정교함을 간직한 작업 환경입니다. 시간의 흔적이 담길수록 깊이를 더해가는 친환경 소재의 감성을 느껴보세요.',
    },
    process: [
      {
        image: '/images/atelier/process-1.png',
        title: '엄밀한 지류 분석과 인쇄 감리',
        description:
          '수입된 파인아트 아카이빙 지류의 습도와 평량을 정밀 진단한 후 최적의 무독성 잉크 안착률을 찾아 인쇄합니다. 디지털에서는 구현되지 않는 오묘하고 기품 있는 질감을 살립니다.',
      },
      {
        image: '/images/atelier/process-2.png',
        title: '사철실 가공과 전통 바인딩',
        description:
          '수년간 훈련된 바인딩 장인들이 실 한 땀 한 땀을 사철 직조기에 걸고, 페이지를 견고하게 엮어냅니다. 이는 책을 완전히 180도 펼쳤을 때 갈라짐이나 파손 없이 수십 년 보존되는 핵심 가치입니다.',
      },
      {
        image: '/images/atelier/process-3.png',
        title: '수제 프레싱 및 품질 검수',
        description:
          '정장 제본 기계 압착 후 수공 프레스로 하루 이상 안착하는 과정을 거쳐 견고하고 완벽한 형태를 구축합니다. 출고 전 미세한 실 가공과 패키징 처리까지 엄밀한 최종 검수가 이루어집니다.',
      },
    ],
    materials: {
      title: '수공예 재질 라이브러리',
      items: [
        {
          eyebrow: 'Papers',
          title: '아치스 파인아트 아카이브지',
          description:
            '시간이 흘러도 산성이 생기지 않아 황변 현상이 전혀 없으며 무광 코팅 특유의 포근한 수묵 질감을 살려냅니다.',
        },
        {
          eyebrow: 'Leathers',
          title: '피렌체 풀그레인 천연 가죽',
          description:
            '이탈리아의 가죽 장인들이 환경에 해가 없는 식물성 타닌 성분만으로 무두질하여, 자연스러운 윤택과 기품이 흐릅니다.',
        },
        {
          eyebrow: 'Fabrics',
          title: '에코 내추럴 벨기에 린넨',
          description:
            '내추럴 벨기에산 마 원료로 수공 직조된 원사 패브릭으로 만졌을 때 포근하고 아늑한 질감을 선사합니다.',
        },
      ],
    },
  },
  layoutGuidelines: {
    hero: {
      eyebrow: '편집 규격 안내',
      title: '레이아웃 가이드라인',
      description:
        '전문 디자이너와 인쇄 장인이 조율한 최상의 포토북 비율과 인쇄 최적화 규격입니다. 올바른 포맷과 여백의 배치 조율을 통해 소장본의 격조를 극대화하세요.',
    },
    specs: {
      eyebrow: '최적화 가이드',
      title: '권장 이미지 규격',
      items: [
        {
          title: '권장 해상도 (Resolution)',
          description:
            '인쇄 선명도를 완벽하게 보존하기 위해 최소 300 DPI 이상의 고화질 JPG/PNG 이미지 파일 활용을 강력히 제안합니다.',
        },
        {
          title: '색상 프로파일 (Color Space)',
          description:
            '풍부한 인쇄 톤 재현을 위해 원본의 sRGB 프로파일을 그대로 사용하세요. 출력 전 장비 캘리브레이션에 맞춰 자동 교정됩니다.',
        },
      ],
    },
    templates: {
      eyebrow: '클래식 템플릿',
      title: '레이아웃 미리보기',
      items: [
        {
          image: '/images/layout-guidelines/classic-single.png',
          title: 'Classic Single',
          description:
            '여백의 미를 살려 한 페이지에 하나의 인물 혹은 풍경을 조화롭게 담아내는 시대를 초월한 기본 포맷.',
        },
        {
          image: '/images/layout-guidelines/panorama-spread.png',
          title: 'Panorama Spread',
          description:
            '사철 제본의 180도 완전 펼침 면을 활용해 웅장한 가로형 사진을 단절 없이 광활하게 전개하는 기법.',
        },
        {
          image: '/images/layout-guidelines/grid-collage.png',
          title: 'Grid Collage',
          description:
            '시간 순서에 따른 감정선이나 디테일 컷들을 2x2 혹은 3x3 격자 배열로 컴팩트하게 연출하는 다큐멘터리 포맷.',
        },
        {
          image: '/images/layout-guidelines/full-bleed.png',
          title: 'Full Bleed',
          description:
            '텍스트나 여백 없이 페이지 전체를 고화질 이미지로 꽉 채워 압도적인 몰입감과 온전한 온기를 전하는 스타일.',
        },
      ],
    },
  },
  ecoPapers: {
    hero: {
      eyebrow: '친환경 용지',
      title: '우리의 종이 약속',
      description:
        '우리가 만드는 모든 책은 지구에 해를 입히지 않고, 오직 소장자에게 감동만을 안기도록 제작됩니다. FSC 인증 친환경 제지로 자연과 아름다운 공존을 만들어갑니다.',
    },
    fsc: {
      title: 'FSC® 인증 및 친환경 콩기름 잉크 공정',
      description:
        'Shiny Book이 사용하는 모든 내지와 커버 패브릭은 산림자원을 지속가능하게 보호하는 국제 산림 관리 협회(FSC)의 합법적 가이드라인에 따라 철저히 추적된 원재료로만 만듭니다. 휘발성 유기 화학물 방출을 차단하는 친환경 식물성 콩기름 배합 잉크를 전면 사용하여 피부에 직접 장시간 닿아도 안전합니다.',
    },
    catalog: {
      eyebrow: '아틀리에 스와치',
      title: '프리미엄 용지 카탈로그',
      items: [
        {
          image: '/images/eco-papers/fine-art-matte.png',
          name: 'Fine Art Matte',
          weight: '240 gsm',
          description:
            '무광택 특유의 극도로 차분하고 깊이 있는 질감으로, 목가적인 풍경이나 차분한 인물 화보 소장에 최적화된 시그니처 한지 풍감 수입지입니다.',
          bestFor: '풍경 및 파인아트 사진에 추천',
        },
        {
          image: '/images/eco-papers/lustre-semi-gloss.png',
          name: 'Lustre Semi-Gloss',
          weight: '260 gsm',
          description:
            '은은하고 고급스러운 미세 반사 코팅 처리가 특징으로, 선명한 원색 보존력과 하이라이트 표현력이 좋아 결혼 앨범 및 생생한 인물 스냅에 뛰어난 매칭률을 보입니다.',
          bestFor: '웨딩 앨범 및 인물 사진에 추천',
        },
        {
          image: '/images/eco-papers/cotton-rag.png',
          name: 'Cotton Rag',
          weight: '310 gsm',
          description:
            '최고급 100% 면 유기 섬유 원료로 제작되어 영구 보존용 무독성 산도 중립 보장과 부드러운 순백색의 기품 있는 두께감을 자랑하는 박물관 등급 파인아트지.',
          bestFor: '아카이브 보존용 작품 인쇄에 추천',
        },
        {
          image: '/images/eco-papers/recycled-kraft.png',
          name: 'Recycled Kraft',
          weight: '180 gsm',
          description:
            '소박하고 정겨운 내추럴 브라운 톤의 100% 지속 가능 친환경 리사이클 지로, 필름 사진이나 여행의 깊은 성찰, 에세이 및 수채화 스케치 수집에 독특한 풍미를 가미합니다.',
          bestFor: '필름 사진 및 여행 저널에 추천',
        },
      ],
    },
    impact: {
      eyebrow: '누적 성과',
      title: '자연 자원 보호 통계',
      asOfLabel: '2026년 7월 기준',
      stats: [
        { value: '1,420+', label: '보호한 나무 수' },
        { value: '12.4톤', label: '탄소 발자국 상쇄량' },
        { value: '32만 리터', label: '절약한 청정수' },
      ],
    },
  },
  sustainability: {
    hero: {
      eyebrow: '생태 이야기',
      title: '우리의 친환경 미션',
      description:
        'Shiny Book은 종이 책이라는 소유의 미학을 지키는 한편, 그 과정이 산림 보존과 푸른 미래에 상처를 남기지 않도록 엄격하고 정직한 탄소배출 제로 시스템을 운영합니다.',
    },
    pillars: {
      eyebrow: '운영 약속',
      title: '지속가능성의 세 기둥',
      items: [
        {
          title: '책임 있는 원료 조달',
          tag: 'FSC 인증 종이 및 친환경 소재',
          description:
            '도입 자재부터 무독성 보증, 산림 추적이 가능한 공정 파인아트지만을 수혈하여 숲 보존에 일조합니다.',
        },
        {
          title: '무폐기물 생산',
          tag: '재단 손실 최소화 설계',
          description:
            '오차 없는 레이아웃 설계로 자투리 가공 손실을 극단적으로 방지하고 자가 재생 사이클을 구동 중입니다.',
        },
        {
          title: '탄소중립 배송',
          tag: '배송 과정 탄소 중립화',
          description:
            '운송 중 발생 탄소량을 상쇄하기 위해 국제 기후 환경 보호 단체 및 산림조성 펀드와 상생을 실천합니다.',
        },
      ],
    },
    roadmap: {
      eyebrow: '로드맵',
      title: '향후 친환경 목표',
      items: [
        {
          year: '2025',
          title: '100% 지속가능 친환경 패키징 전면 이행',
          description:
            '완충재부터 접착 테이프까지 모든 도서 포장재를 생분해 유기 원료로 완벽 전환.',
        },
        {
          year: '2026',
          title: '태양광 발전 아틀리에 자가 에너지 구축',
          description:
            '전문 인쇄 및 수제 바인딩 공방 지붕에 태양열 패널을 설치해 무탄소 운영에 도달할 예정.',
        },
      ],
    },
  },
  shippingPolicy: {
    hero: {
      eyebrow: '배송 정책',
      title: '안전한 여정',
      description:
        '전문 제작 장인의 마무리를 거친 소장본을 집 앞까지 완벽한 비훼손 보존 상태로 전달해 드리기 위한 세심하고 엄격한 배송 안전 가이드입니다.',
    },
    methods: {
      eyebrow: '배송 등급',
      title: '배송 방식 및 요금',
    },
    viewPricingButton: '배송 요금 보러 가기',
    packaging: {
      eyebrow: '언박싱 경험',
      title: '맞춤 보존 패키징',
      description:
        '우리는 도서의 모서리가 운송 도중 찌그러지거나 표면에 스크래치가 발생하는 상황을 철저히 차단하고자 견고한 재생 카드보드로 제작된 도서 보호 프레임 및 중성 습기 제어 종이 파우치로 이중 보습/방습 진공 패키징을 거쳐 발송합니다.',
      subtitle: '이중 보호 박스와 무독성 완충재',
      badgeLabel: '맞춤 제작 하드 박스 무상 포함',
    },
    returns: {
      title: '반품 및 제작 상 교환 규정',
      description:
        'Shiny Book의 포토북은 고객님의 사적인 사진과 개인 설정 템플릿에 따라 개별 맞춤 가동 생산되는 커스텀 성격의 도서입니다. 이에 따라 단순 변심에 의한 중간 주문 취소 및 환불 조치는 불가능합니다. 다만 도서 자체의 파손 혹은 제본 불량 하자가 발견되는 경우에는 수령 후 7일 이내에 무상으로 빠른 재인쇄 교환 처리를 약속합니다.',
    },
  },
  press: {
    hero: {
      eyebrow: '미디어 및 언론 대응',
      title: '보도자료 문의',
      description:
        'Shiny Book의 수공예 감성 아틀리에 보존 가치와 디자인 중심의 브랜드 연출 자료들을 한데 모았습니다.',
    },
    features: {
      title: '최근 언론 보도',
      items: [
        {
          date: '2025.10',
          outlet: 'Classic Living Korea',
          headline: '수제 제본의 전통과 최신 편집 기술의 우아한 만남, Shiny Book',
        },
        {
          date: '2025.08',
          outlet: 'The Atelier Weekly',
          headline: '가장 개인적이며 고유한 일상을 영구 보존용 파인아트북에 인쇄하여 물려주는 가치',
        },
        {
          date: '2025.05',
          outlet: 'Eco Design Digest',
          headline: 'FSC 인증 생분해 종이와 무독성 콩기름 잉크로 완성한 프리미엄 아카이빙 포토북',
        },
      ],
    },
    contact: {
      title: '미디어 문의',
      description: '인터뷰, 취재, 협업 제안 등 언론 관련 문의는 이메일로 연락 부탁드립니다.',
      buttonLabel: '이메일로 문의하기',
    },
    factSheet: {
      title: '회사 정보',
      items: [
        { label: 'Founded', value: '2023 | 서울 성수동 수제 바인딩 아틀리에 기원' },
        {
          label: 'Key Products',
          value: '친환경 양장 포토북, 수제 린넨 저널, 가죽 패밀리 대형 앨범',
        },
        {
          label: 'Production Method',
          value: '180도 레이플랫 사철 실 제본 및 친환경 콩기름 프린트',
        },
        {
          label: 'Milestones',
          value: '출판 수량 10,000부 돌파 및 지속적 자연 가치 복원 상쇄 동참',
        },
      ],
    },
  },
  review: {
    title: '구매후기',
    empty: '등록된 후기가 없습니다.',
    hero: {
      eyebrow: 'Customer Board',
      title: 'Customer Reviews',
      averageLabel: '전체 평점',
      totalReviewsLabel: '{count}개의 후기',
    },
    filters: {
      allProducts: '전체 상품',
    },
  },
  legal: {
    lastUpdatedLabel: '최종 개정일',
    terms: {
      title: '이용약관',
      lastUpdated: '2026년 8월 14일',
      sections: [
        {
          heading: '제1조 (목적)',
          body: '이 약관은 Shiny Book(이하 "몰")이 운영하는 인터넷사이버몰에서 제공하는 도서 인쇄 서비스를 이용함에 있어 몰과 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.',
        },
        {
          heading: '제2조 (정의)',
          body: '"몰"이란 회사가 재화 또는 용역을 이용자에게 제공하기 위해 운영하는 웹사이트를 말합니다. "이용자"란 몰에 접속하여 이 약관에 따라 몰이 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다. "회원"이란 몰에 회원등록을 한 자로서, 계속적으로 몰이 제공하는 서비스를 이용할 수 있는 자를 말합니다.',
        },
        {
          heading: '제3조 (약관의 명시와 설명 및 개정)',
          body: '몰은 이 약관의 내용을 이용자가 알 수 있도록 초기 화면에 게시합니다. 몰은 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 개정 시 적용일자와 개정사유를 명시하여 현행 약관과 함께 사전 공지합니다.',
        },
        {
          heading: '제4조 (서비스의 제공 및 변경)',
          body: '몰은 원고/표지 업로드, 주문 제작, 결제, 배송 조회 등의 서비스를 제공합니다. 몰은 재화 등의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 등의 내용을 변경할 수 있습니다.',
        },
        {
          heading: '제5조 (서비스의 중단)',
          body: '몰은 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.',
        },
        {
          heading: '제6조 (회원가입)',
          body: '이용자는 몰이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청하며, 몰이 이러한 신청에 대하여 승낙함으로써 회원가입 계약이 체결됩니다.',
        },
        {
          heading: '제7조 (회원 탈퇴 및 자격 상실 등)',
          body: '회원은 몰에 언제든지 탈퇴를 요청할 수 있으며 몰은 즉시 회원탈퇴를 처리합니다. 회원이 관계 법령을 위반하거나 이 약관을 위반한 경우 몰은 회원자격을 제한 및 정지시킬 수 있습니다.',
        },
        {
          heading: '제8조 (회원에 대한 통지)',
          body: '몰이 회원에 대한 통지를 하는 경우, 회원이 가입 시 제출한 전자우편 주소 또는 마이페이지 내 알림으로 할 수 있습니다.',
        },
        {
          heading: '제9조 (구매신청 및 개인정보 제공 동의 등)',
          body: '이용자는 원고 및 표지 파일 업로드, 도서명, 수량 등을 입력하는 방법으로 구매를 신청하며, 이 과정에서 몰은 배송 등 서비스 제공에 필요한 개인정보를 이용자에게 요청할 수 있습니다.',
        },
        {
          heading: '제10조 (계약의 성립)',
          body: '몰은 제9조와 같은 구매신청에 대하여 내용에 허위, 기재누락, 오기가 있는 경우를 제외하고 승낙하며, 몰의 승낙이 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.',
        },
        {
          heading: '제11조 (지급방법)',
          body: '몰에서 구매한 재화 등에 대한 대금지급방법은 신용카드 등 다양한 결제수단으로 할 수 있으며, 결제는 결제대행사(PG사)인 토스페이먼츠 주식회사를 통해 처리됩니다.',
        },
        {
          heading: '제12조 (수신확인통지·구매신청 변경 및 취소)',
          body: '몰은 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를 합니다. 이용자는 수신확인통지를 받은 후 제작 착수 전까지 구매신청 변경 및 취소를 요청할 수 있습니다.',
        },
        {
          heading: '제13조 (재화 등의 공급)',
          body: '몰은 이용자와 재화의 공급시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 조치합니다.',
        },
        {
          heading: '제14조 (환급)',
          body: '몰은 이용자가 구매신청한 재화 등을 공급할 수 없을 때에는 지체 없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 3영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다.',
        },
        {
          heading: '제15조 (청약철회 등)',
          body: '몰과 재화 등의 구매에 관한 계약을 체결한 이용자는 계약체결일부터 7일 이내에는 청약철회를 할 수 있습니다. 다만 이용자의 요청에 따라 개별 제작되는 인쇄물의 특성상, 제작이 개시된 이후에는 청약철회가 제한될 수 있습니다.',
        },
        {
          heading: '제16조 (청약철회 등의 효과)',
          body: '몰은 재화 등의 반환을 받은 경우 3영업일 이내에 이미 지급받은 재화 등의 대금을 환급하며, 청약철회로 인한 반환비용은 관련 법령에 따라 부담 주체를 정합니다.',
        },
        {
          heading: '제17조 (개인정보보호)',
          body: '몰은 이용자의 개인정보 수집 시 서비스제공에 필요한 최소한의 개인정보를 수집하며, 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다. 자세한 사항은 개인정보처리방침을 따릅니다.',
        },
        {
          heading: '제18조 ("몰"의 의무)',
          body: '몰은 법령과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며, 지속적이고 안정적인 서비스 제공을 위해 최선을 다합니다. 몰은 이용자의 개인정보 보호를 위한 보안시스템을 갖춥니다.',
        },
        {
          heading: '제19조 (회원의 ID 및 비밀번호에 대한 의무)',
          body: '회원의 계정에 관한 관리책임은 회원 본인에게 있으며 이를 제3자가 이용하게 하여서는 안 됩니다. 계정이 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 즉시 몰에 통보하여야 합니다.',
        },
        {
          heading: '제20조 (이용자의 의무)',
          body: '이용자는 신청 또는 변경 시 허위 내용을 등록하지 않으며, 타인의 정보를 도용하거나 몰에 게시된 정보를 변경해서는 안 됩니다. 또한 타인의 저작권 등 지식재산권을 침해하는 원고나 표지를 업로드해서는 안 됩니다.',
        },
        {
          heading: '제21조 (연결"몰"과 피연결"몰" 간의 관계)',
          body: '상위 몰과 하위 몰이 하이퍼링크(예: 하이퍼링크의 대상에는 문자, 그림 및 동화상 등이 포함)방식 등으로 연결된 경우, 전자를 연결 몰이라고 하고 후자를 피연결 몰이라고 합니다. 연결 몰은 피연결 몰이 독자적으로 제공하는 재화 등에 의하여 이용자와 행하는 거래에 대해서는 보증 책임을 지지 않습니다.',
        },
        {
          heading: '제22조 (저작권의 귀속 및 이용제한)',
          body: '이용자가 업로드한 원고 및 표지에 대한 저작권은 이용자에게 귀속됩니다. 몰이 작성한 저작물에 대한 저작권 및 기타 지식재산권은 몰에 귀속하며, 이용자는 몰을 이용함으로써 얻은 정보를 몰의 사전 승낙 없이 영리목적으로 이용할 수 없습니다.',
        },
        {
          heading: '제23조 (분쟁해결)',
          body: '몰은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 피해를 보상처리하기 위해 고객센터를 운영합니다. 몰과 이용자 간에 발생한 분쟁은 전자상거래분쟁조정위원회 등 분쟁조정기관의 조정을 활용할 수 있습니다.',
        },
        {
          heading: '제24조 (재판권 및 준거법)',
          body: '몰과 이용자 간에 발생한 분쟁에 관한 소송은 제소 당시 이용자의 주소에 의하며, 주소가 없는 경우 거소를 관할하는 지방법원의 전속관할로 하고, 이 약관과 관련된 분쟁에는 대한민국 법을 적용합니다.',
        },
        {
          heading: '사업자 정보',
          body: '상호명: Shiny Book\n대표자: 홍길동\n사업자등록번호: 000-00-00000\n통신판매업 신고번호: 제2026-서울중구-0000호\n주소: 서울특별시 중구 세종대로 110\n전화번호: 02-0000-0000\n이메일: example@example.com',
        },
      ],
    },
    privacy: {
      title: '개인정보처리방침',
      lastUpdated: '2026년 8월 14일',
      sections: [
        {
          heading: '1. 수집하는 개인정보 항목',
          body: '몰은 회원가입 및 서비스 제공을 위해 이메일 주소, 비밀번호(암호화 저장)를 수집합니다. 주문 및 배송을 위해 추가로 수취인 정보를 수집할 수 있습니다.',
        },
        {
          heading: '2. 개인정보의 수집 및 이용목적',
          body: '수집한 개인정보는 회원 식별 및 로그인 인증, 주문 처리 및 배송, 고객 문의 응대, 결제 처리 목적으로만 이용합니다.',
        },
        {
          heading: '3. 개인정보의 보유 및 이용기간',
          body: '회원 탈퇴 시 개인정보를 지체 없이 파기합니다. 다만 관계 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.',
        },
        {
          heading: '4. 개인정보의 제3자 제공',
          body: '몰은 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다. 다만 배송을 위해 필요한 최소한의 정보를 택배사에 제공할 수 있습니다.',
        },
        {
          heading: '5. 개인정보처리 위탁',
          body: '몰은 결제 처리 업무를 토스페이먼츠 주식회사에 위탁하고 있으며, 위탁계약 시 개인정보가 안전하게 관리되도록 필요한 사항을 규정합니다.',
        },
        {
          heading: '6. 이용자의 권리와 행사방법',
          body: '이용자는 언제든지 마이페이지를 통해 본인의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 통해 개인정보 수집 및 이용 동의를 철회할 수 있습니다.',
        },
        {
          heading: '7. 개인정보의 파기',
          body: '개인정보 보유기간이 경과하거나 처리목적이 달성된 경우, 지체 없이 해당 개인정보를 파기합니다.',
        },
        {
          heading: '8. 개인정보 보호책임자',
          body: '개인정보 보호책임자: 홍길동 / 연락처: example@example.com',
        },
      ],
    },
  },
} as const;

import type { AnnouncementCategory } from '@/constants/announcement-category';
import type { ApiErrorCode } from '@/constants/api-errors';
import type { OrderStatus } from '@/constants/order-status';

export const ko = {
  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다.',
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
      login: '로그인',
      signup: '회원가입',
      mypage: '마이페이지',
      logout: '로그아웃',
      startOrder: '주문 시작하기',
      changeLanguage: '언어 변경',
      switchToLightMode: '라이트 모드로 전환',
      switchToDarkMode: '다크 모드로 전환',
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
        prevLabel: '이전 후기',
        nextLabel: '다음 후기',
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
  } satisfies Record<OrderStatus, string>,
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
  } satisfies Record<ApiErrorCode, string>,
  checkout: {
    title: '결제하기',
    summaryTitle: '주문 요약',
    paymentTitle: '결제 방식',
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
    backToMypageButton: '마이페이지로 돌아가기',
  },
  admin: {
    nav: {
      orders: '주문 목록',
      coupons: '쿠폰 관리',
      announcements: '공지사항 관리',
      faqs: 'FAQ 관리',
      inquiries: '문의 관리',
    },
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
        files: '파일',
        actions: '관리',
      },
      quantitySuffix: '권',
      advanceButton: '다음 단계로 진행',
      manuscriptButton: '원고 보기',
      coverButton: '표지 보기',
      fileViewError: '파일을 불러오지 못했습니다.',
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
      activateButton: '활성화',
      deactivateButton: '비활성화',
      form: {
        codeLabel: '쿠폰 코드',
        discountTypeLabel: '할인 유형',
        discountValueLabel: '할인 값',
        maxUsesLabel: '최대 사용 횟수',
        expiresAtLabel: '만료일',
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
      errors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        code_taken: '이미 존재하는 쿠폰 코드입니다.',
        conflict: '다른 곳에서 이미 변경됐습니다. 새로고침 후 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
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
      statusPending: '답변대기',
      statusAnswered: '답변완료',
      viewLink: '보기',
      answerLabel: '답변',
      answerButton: '답변 등록',
      answering: '등록 중...',
      answerSuccess: '답변이 등록됐습니다.',
      errors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
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
      signupPrompt: '아직 계정이 없으신가요?',
      signupLink: '회원가입',
      errors: {
        emailInvalid: '올바른 이메일을 입력해주세요.',
        passwordRequired: '비밀번호를 입력해주세요.',
        invalid_credentials: '이메일 또는 비밀번호를 확인해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    signup: {
      title: '회원가입',
      emailLabel: '이메일',
      passwordLabel: '비밀번호',
      passwordConfirmLabel: '비밀번호 확인',
      submitButton: '회원가입',
      submitting: '가입 처리 중...',
      loginPrompt: '이미 계정이 있으신가요?',
      loginLink: '로그인',
      errors: {
        emailInvalid: '올바른 이메일을 입력해주세요.',
        passwordTooShort: '비밀번호는 6자 이상이어야 합니다.',
        passwordMismatch: '비밀번호가 일치하지 않습니다.',
        email_taken: '이미 가입된 이메일입니다.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    mypage: {
      title: '마이페이지',
      signOutButton: '로그아웃',
      newOrderButton: '새 주문 만들기',
      accountButton: '회원정보 변경',
      inquiriesButton: '1:1 문의',
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
        },
        quantitySuffix: '권',
        reviewLink: '후기',
      },
    },
    account: {
      title: '회원정보 변경',
      passwordLabel: '새 비밀번호',
      passwordConfirmLabel: '새 비밀번호 확인',
      submitButton: '변경하기',
      submitting: '변경 중...',
      success: '비밀번호가 변경됐습니다.',
      errors: {
        passwordTooShort: '비밀번호는 6자 이상이어야 합니다.',
        passwordMismatch: '비밀번호가 일치하지 않습니다.',
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    orderNew: {
      title: '주문 만들기',
      titleLabel: '도서명',
      quantityLabel: '수량',
      manuscriptLabel: '원고 파일 (PDF)',
      coverLabel: '표지 이미지',
      couponLabel: '쿠폰 코드 (선택)',
      submitButton: '결제하러 가기',
      submitting: '주문 생성 중...',
      status: {
        uploading: '업로드 중...',
        processing: '이미지 처리 중...',
        done: '업로드 완료',
      },
      errors: {
        titleRequired: '도서명을 입력해주세요.',
        quantityInvalid: '수량은 1권 이상이어야 합니다.',
        uploadFailed: '파일 업로드에 실패했습니다. 다시 시도해주세요.',
        filesRequired: '원고와 표지 파일을 모두 업로드해주세요.',
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        coupon_not_found: '존재하지 않는 쿠폰 코드입니다.',
        coupon_inactive: '사용할 수 없는 쿠폰입니다.',
        coupon_expired: '만료된 쿠폰입니다.',
        coupon_usage_limit_reached: '사용 횟수를 초과한 쿠폰입니다.',
        coupon_conflict: '다른 곳에서 먼저 사용된 쿠폰입니다. 다시 시도해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    inquiries: {
      title: '1:1 문의',
      newTitle: '문의하기',
      newButton: '문의하기',
      empty: '문의 내역이 없습니다.',
      statusPending: '답변대기',
      statusAnswered: '답변완료',
      answerLabel: '답변',
      backToList: '목록으로 돌아가기',
      form: {
        titleLabel: '제목',
        contentLabel: '내용',
        submitButton: '문의하기',
        submitting: '등록 중...',
      },
      errors: {
        unauthorized: '권한이 없습니다. 다시 로그인해주세요.',
        validation_failed: '입력값을 다시 확인해주세요.',
        unexpected_error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    reviews: {
      notCompleted: '완료된 주문만 후기를 작성할 수 있습니다.',
      ratingLabel: '평점',
      form: {
        ratingLabel: '평점',
        contentLabel: '후기 내용',
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
      title: '공지사항',
      empty: '등록된 공지사항이 없습니다.',
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
      title: '가격 및 옵션 안내',
      description:
        'Shiny Book은 소중한 순간에 걸맞은 타협 없는 가치를 제안합니다. 복잡한 계산 없이 명확하고 합리적인 패키지 플랜으로 품격 높은 소장본을 제작하세요.',
    },
    tiers: [
      {
        name: 'Essential',
        image: '/images/pricing/essential.png',
        price: '₩45,000~',
        features: [
          '가벼운 소프트커버 마감',
          '40페이지 기본 제공',
          '고급 매트 수입지',
          '수제 반양장식 사철 제본',
          '모바일 전용 간편 편집',
          '기본 친환경 무지 상자 배송',
        ],
      },
      {
        name: 'Classic',
        image: '/images/pricing/classic.png',
        price: '₩85,000~',
        features: [
          '견고한 보드 하드커버',
          '60페이지 기본 제공',
          '무독성 아카이빙 페이퍼',
          '완벽히 펼쳐지는 180도 레이플랫',
          '클래식 잡지 스타일 레이아웃',
          '고급 린넨 북 파우치 포장',
        ],
      },
      {
        name: 'Premium',
        image: '/images/pricing/premium.png',
        price: '₩160,000~',
        features: [
          '최고급 이탈리아산 풀그레인 가죽',
          '80페이지 기본 제공',
          '보존용 최고급 파인아트지',
          '전통 양장 사철 제본 + 리본 마감',
          '1:1 디자이너 맞춤 편집 코칭',
          '인그레이빙 각인 전용 우드 케이스',
        ],
      },
    ],
    ctaLabel: '내 책 만들기',
    specsTitle: '상세 사양 비교',
    specsCategoryLabel: '구분',
    specRows: [
      { label: '기본 제공 페이지', values: ['40p', '60p', '80p'] },
      {
        label: '제본 방식',
        values: ['사철 제본 (소프트)', '180도 수제 사철 양장', '전통 무독성 풀양장 수공'],
      },
      {
        label: '사용 지류',
        values: ['매트 수입지 (150g)', '아카이빙 페이퍼 (180g)', '최고급 파인아트 아치스지 (240g)'],
      },
      {
        label: '커버 패브릭 옵션',
        values: [
          '컬러풀 종이 코팅 커버',
          '프리미엄 린넨 5종 / 가죽 2종',
          '풀그레인 가죽 4종 / 실크 패브릭',
        ],
      },
      {
        label: '디자인 보정 서비스',
        values: [
          '기본 사진 정렬',
          '스튜디오 템플릿 + 자동 보정',
          '전문 디자이너 1:1 레이아웃 리터칭',
        ],
      },
      {
        label: '포장 및 패키지',
        values: ['일반 친환경 에코 박스', '린넨 보관백 + 하드웨어 상자', '맞춤형 원목 우드 케이스'],
      },
    ],
    volumeDiscount: {
      title: '수량 할인 및 정기 도서관 지원',
      description:
        '독립출판, 사진 동호회, 전시 카탈로그, 또는 대량 가족 기념 서적 제작을 위해 동일한 파일로 5권 이상 대량 주문 시 할인 혜택을 드립니다.',
      tiers: [
        { range: '5 - 9권', description: '전체 제작 비용의 10% 자동 할인' },
        { range: '10 - 29권', description: '전체 제작 비용의 20% 자동 할인' },
        { range: '30권 이상', description: '디자이너 밀착 지원 및 견적 협의 (최대 35%)' },
      ],
    },
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
    cta: {
      eyebrow: '지금 시작하기',
      title: '자연과 사람을 배려하는 품격 있는 제작',
      description:
        '친환경 무독성 종이와 가죽 커버 패브릭으로 아이의 일상, 인생 최고의 결혼식 이야기를 가장 우아한 책으로 만들어보세요.',
      buttonLabel: '지속가능한 책 만들기',
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
      headers: {
        method: '배송 방식',
        duration: '배송 기한',
        cost: '비용',
        coverage: '대상',
      },
      items: [
        {
          method: 'Standard Delivery (일반 배송)',
          duration: '7-10 영업일 이내',
          cost: '무료 (₩100,000 이상 주문 시)',
          coverage: '도서산간 외 전국 지원',
        },
        {
          method: 'Express Custom (특급 신속 배송)',
          duration: '3-5 영업일 이내',
          cost: '₩8,000 (전국 고정 균일가)',
          coverage: '맞춤 최우선 긴급 가동',
        },
        {
          method: 'Atelier Premium (장인 직배송)',
          duration: '동일 주간 예약 배송',
          cost: '₩15,000',
          coverage: '서울 및 수도권 한정 제공',
        },
      ],
    },
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

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
      notices: '공지사항',
      faq: 'FAQ',
      reviews: '후기',
      login: '로그인',
      signup: '회원가입',
      mypage: '마이페이지',
      logout: '로그아웃',
      startOrder: '주문 시작하기',
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
    title: '자주 묻는 질문',
    empty: '등록된 FAQ가 없습니다.',
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

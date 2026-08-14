export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin',
  COUPONS: '/admin/coupons',
  ANNOUNCEMENTS: '/admin/announcements',
  FAQS: '/admin/faqs',
  INQUIRIES: '/admin/inquiries',
} as const;

export const CONSUMER_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  MYPAGE: '/mypage',
  NEW_ORDER: '/mypage/orders/new',
  ACCOUNT: '/mypage/account',
  INQUIRIES: '/mypage/inquiries',
  NEW_INQUIRY: '/mypage/inquiries/new',
} as const;

export const NOTICE_ROUTES = {
  LIST: '/notices',
} as const;

export const FAQ_ROUTES = {
  LIST: '/faq',
} as const;

export const REVIEW_ROUTES = {
  LIST: '/reviews',
} as const;

export const LEGAL_ROUTES = {
  TERMS: '/terms',
  PRIVACY: '/privacy',
} as const;

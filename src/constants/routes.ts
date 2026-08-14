export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin',
  COUPONS: '/admin/coupons',
  ANNOUNCEMENTS: '/admin/announcements',
} as const;

export const CONSUMER_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  MYPAGE: '/mypage',
  NEW_ORDER: '/mypage/orders/new',
  ACCOUNT: '/mypage/account',
} as const;

export const NOTICE_ROUTES = {
  LIST: '/notices',
} as const;

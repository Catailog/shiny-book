export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin',
  COUPONS: '/admin/coupons',
} as const;

export const CONSUMER_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  MYPAGE: '/mypage',
  NEW_ORDER: '/mypage/orders/new',
  ACCOUNT: '/mypage/account',
} as const;

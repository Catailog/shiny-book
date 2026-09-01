export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin',
  ORDERS: '/admin/orders',
  COUPONS: '/admin/coupons',
  COUPONS_NEW: '/admin/coupons/new',
  ANNOUNCEMENTS: '/admin/announcements',
  ANNOUNCEMENTS_NEW: '/admin/announcements/new',
  FAQS: '/admin/faqs',
  FAQS_NEW: '/admin/faqs/new',
  INQUIRIES: '/admin/inquiries',
  REFUNDS: '/admin/refunds',
  PRODUCTS: '/admin/products',
  PRODUCTS_NEW: '/admin/products/new',
} as const;

export const CONSUMER_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  MYPAGE: '/mypage',
  NEW_ORDER: '/orders/new',
  ACCOUNT: '/mypage/account',
  INQUIRIES: '/mypage/inquiries',
  NEW_INQUIRY: '/mypage/inquiries/new',
  CHECKOUT: '/checkout',
} as const;

export const NOTICE_ROUTES = {
  LIST: '/notices',
} as const;

export const API_ROUTES = {
  AI_CHAT: '/api/ai/chat',
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

export const PRODUCT_ROUTES = {
  LIST: '/products',
} as const;

export const MARKETING_ROUTES = {
  GALLERY: '/gallery',
  PRICING: '/pricing',
  ABOUT: '/about',
  ATELIER: '/atelier',
  SUSTAINABILITY: '/sustainability',
  PRESS: '/press',
  LAYOUT_GUIDELINES: '/layout-guidelines',
  ECO_PAPERS: '/eco-papers',
  SHIPPING_POLICY: '/shipping-policy',
} as const;

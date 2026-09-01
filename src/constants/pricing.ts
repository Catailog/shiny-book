export const PRICING = {
  BOOK_UNIT_PRICE_KRW: 10,
  PRICE_PER_PAGE_KRW: 5,
} as const;

export const SHIPPING = {
  BASE_FEE_KRW: 2000,
  JEJU_SURCHARGE_KRW: 3000,
  REMOTE_AREA_SURCHARGE_KRW: 5000,
  FREE_SHIPPING_THRESHOLD_KRW: 10000,
} as const;

// Postal-code prefixes that carry a delivery surcharge. Jeju (all 63xxx) is
// billed separately from other 도서산간 (remote islands / mountain villages).
// The remote list is a representative starter set - swap in the courier's
// official 도서산간 table once one is chosen.
export const JEJU_POSTAL_CODE_PREFIX = '63';

export const REMOTE_AREA_POSTAL_PREFIXES: readonly string[] = [
  '402', // 경북 울릉군 (울릉도)
  '231', // 인천 옹진군 도서 (백령도/연평도/덕적도 등)
  '588', // 전남 신안군 도서
];

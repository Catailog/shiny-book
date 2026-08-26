export const ORDER_TITLE_MAX_LENGTH = 20;

// 표지 인쇄용 - 한글/영문/숫자/기본 문장부호만 허용(이모지 등 인쇄 폰트가 지원 못하는 문자 차단)
export const ORDER_TITLE_ALLOWED_CHARS_REGEX =
  /^[\p{Script=Hangul}\p{Script=Latin}0-9\s.,!?()'-]+$/u;

export const ORDER_QUANTITY_MAX = 100;

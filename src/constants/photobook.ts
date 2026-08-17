export const PHOTOBOOK_PAGE_COUNT_MIN = 8;
export const PHOTOBOOK_PAGE_COUNT_MAX = 16;
export const PHOTOBOOK_PAGE_COUNT_STEP = 2;
export const PHOTOBOOK_PHOTOS_PER_PAGE = 2;

export const PHOTOBOOK_PAGE_COUNT_OPTIONS: readonly number[] = Array.from(
  {
    length: (PHOTOBOOK_PAGE_COUNT_MAX - PHOTOBOOK_PAGE_COUNT_MIN) / PHOTOBOOK_PAGE_COUNT_STEP + 1,
  },
  (_, index) => PHOTOBOOK_PAGE_COUNT_MIN + index * PHOTOBOOK_PAGE_COUNT_STEP,
);

export function isPhotobookPageCount(value: number): boolean {
  return PHOTOBOOK_PAGE_COUNT_OPTIONS.includes(value);
}

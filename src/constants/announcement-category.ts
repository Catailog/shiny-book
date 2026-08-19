export const ANNOUNCEMENT_CATEGORY = {
  NOTICE: 'notice',
  EVENT: 'event',
  WINNER: 'winner',
} as const;

export type AnnouncementCategory =
  (typeof ANNOUNCEMENT_CATEGORY)[keyof typeof ANNOUNCEMENT_CATEGORY];

const ANNOUNCEMENT_CATEGORY_VALUES: readonly AnnouncementCategory[] =
  Object.values(ANNOUNCEMENT_CATEGORY);

export function isAnnouncementCategory(value: string): value is AnnouncementCategory {
  return ANNOUNCEMENT_CATEGORY_VALUES.some((category) => category === value);
}

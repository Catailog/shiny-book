export const INQUIRY_TITLE_MAX_LENGTH = 200;
export const INQUIRY_CONTENT_MAX_LENGTH = 5000;
export const INQUIRY_ANSWER_MAX_LENGTH = 5000;
export const ADMIN_INQUIRY_LIST_LIMIT = 50;
export const CONSUMER_INQUIRY_LIST_LIMIT = 50;
export const ADMIN_NOTIFICATION_BADGE_MAX = 99;

export const INQUIRY_MESSAGE_AUTHOR = {
  CONSUMER: 'consumer',
  ADMIN: 'admin',
} as const;

export type InquiryMessageAuthor =
  (typeof INQUIRY_MESSAGE_AUTHOR)[keyof typeof INQUIRY_MESSAGE_AUTHOR];

const INQUIRY_MESSAGE_AUTHOR_VALUES: readonly InquiryMessageAuthor[] =
  Object.values(INQUIRY_MESSAGE_AUTHOR);

export function isInquiryMessageAuthor(value: string): value is InquiryMessageAuthor {
  return INQUIRY_MESSAGE_AUTHOR_VALUES.some((author) => author === value);
}

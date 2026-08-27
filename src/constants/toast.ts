// sonner 기본값(4000ms)은 문장 하나짜리 에러 메시지를 읽기엔 짧아서 늘림
export const TOAST_DURATION_MS = 6000;

// Stable ids for toasts that must be updated or dismissed later in place instead of
// stacking a new toast each time.
export const TOAST_ID = {
  ORDER_PHOTO_COUNT_EXCEEDED: 'order-photo-count-exceeded',
  ORDER_PHOTO_UPLOAD_FAILED: 'order-photo-upload-failed',
} as const;

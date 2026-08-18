export const FILE_UPLOAD_KIND = {
  PHOTO: 'photo',
  AVATAR: 'avatar',
} as const;

export type FileUploadKind = (typeof FILE_UPLOAD_KIND)[keyof typeof FILE_UPLOAD_KIND];

export const STORAGE_BUCKETS = {
  ORDER_UPLOADS: 'order-uploads',
} as const;

interface FileUploadRule {
  allowedMimeTypes: readonly string[];
  maxSizeBytes: number;
}

export const FILE_UPLOAD_RULES: Record<FileUploadKind, FileUploadRule> = {
  [FILE_UPLOAD_KIND.PHOTO]: {
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxSizeBytes: 20 * 1024 * 1024,
  },
  [FILE_UPLOAD_KIND.AVATAR]: {
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024,
  },
};

export const PROCESSED_PHOTO_IMAGE = {
  WIDTH: 1000,
  HEIGHT: 1400,
  WEBP_QUALITY: 82,
} as const;

export const SIGNED_FILE_URL_EXPIRY_SECONDS = 60 * 5;

export const TEST_PHOTO_TEMPLATE_PATH = '_test-fixtures/sample.webp';

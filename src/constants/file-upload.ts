export const FILE_UPLOAD_KIND = {
  MANUSCRIPT: 'manuscript',
  COVER: 'cover',
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
  [FILE_UPLOAD_KIND.MANUSCRIPT]: {
    allowedMimeTypes: ['application/pdf'],
    maxSizeBytes: 50 * 1024 * 1024,
  },
  [FILE_UPLOAD_KIND.COVER]: {
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxSizeBytes: 20 * 1024 * 1024,
  },
};

export const COVER_PROCESSED_IMAGE = {
  WIDTH: 1000,
  HEIGHT: 1400,
  WEBP_QUALITY: 82,
} as const;

export const SIGNED_FILE_URL_EXPIRY_SECONDS = 60 * 5;

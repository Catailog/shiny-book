export const FILE_UPLOAD_KIND = {
  PHOTO: 'photo',
  AVATAR: 'avatar',
} as const;

export type FileUploadKind = (typeof FILE_UPLOAD_KIND)[keyof typeof FILE_UPLOAD_KIND];

export const STORAGE_BUCKETS = {
  ORDER_UPLOADS: 'order-uploads',
  PRODUCT_IMAGES: 'product-images',
} as const;

export interface FileUploadRule {
  allowedMimeTypes: readonly string[];
  maxSizeBytes: number;
}

export const FILE_UPLOAD_RULES: Record<FileUploadKind, FileUploadRule> = {
  [FILE_UPLOAD_KIND.PHOTO]: {
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxSizeBytes: 1 * 1024 * 1024,
  },
  [FILE_UPLOAD_KIND.AVATAR]: {
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024,
  },
};

export const PRODUCT_IMAGE_UPLOAD_RULE: FileUploadRule = {
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  maxSizeBytes: 5 * 1024 * 1024,
};

// Stored object extension is derived from the (already validated) upload MIME type, so
// the object name never depends on a client-supplied file name.
export const IMAGE_UPLOAD_EXTENSION_BY_MIME: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

export const PROCESSED_PHOTO_IMAGE = {
  WIDTH: 1000,
  HEIGHT: 1400,
  WEBP_QUALITY: 82,
} as const;

export const SIGNED_FILE_URL_EXPIRY_SECONDS = 60 * 5;

// How many raw photo files to push to Supabase Storage at once (client -> Storage, not
// a Server Action, so this is real parallelism).
export const ORDER_PHOTO_UPLOAD_CONCURRENCY = 4;

// Uploaded photos are processed in chunks of this size (one processOrderPhotos Server
// Action per chunk), so each request stays short, progress updates as chunks finish,
// and a failure only affects one chunk.
export const ORDER_PHOTO_PROCESS_CHUNK_SIZE = 8;

// Within a single processOrderPhotos call, how many images to decode/encode at once -
// caps memory/CPU on a small host.
export const ORDER_PHOTO_PROCESS_CONCURRENCY = 4;

// A client -> Storage upload that fails is usually transient (network blip), so retry it
// once before giving up on that photo. The signed upload token stays valid across a
// failed attempt.
export const ORDER_PHOTO_UPLOAD_RETRY_ATTEMPTS = 2;
export const ORDER_PHOTO_UPLOAD_RETRY_DELAY_MS = 600;

export const TEST_PHOTO_POOL = {
  PREFIX: '_test-fixtures/pool/',
  SIZE: 960,
} as const;

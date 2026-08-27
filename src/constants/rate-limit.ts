export const API_RATE_LIMIT = {
  MAX_REQUESTS: 60,
  WINDOW: '1 m',
} as const;

export const AUTH_ACTION_RATE_LIMIT = {
  MAX_REQUESTS: 5,
  WINDOW: '1 m',
} as const;

export const GENERAL_ACTION_RATE_LIMIT = {
  MAX_REQUESTS: 60,
  WINDOW: '1 m',
} as const;

// Photo processing Server Action (processOrderPhotos, one call per 8-photo chunk).
// Checked inside the action (not the proxy) so a hit comes back as a proper result with
// a retry time instead of a bare 429. A full 32-photo book is 4 calls; 40/min leaves
// ~4x headroom for retries while staying well under the proxy's general backstop.
export const PHOTO_UPLOAD_ACTION_RATE_LIMIT = {
  MAX_REQUESTS: 40,
  WINDOW: '1 m',
} as const;

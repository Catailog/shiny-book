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

export const LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

// Correlation id header. `proxy.ts` sets it on the forwarded request so Server
// Components / Actions read a stable value; Route Handlers echo it on responses.
export const REQUEST_ID_HEADER = 'x-request-id';

// Default level per environment. Production keeps `info` so request lines and
// business events are captured; development is verbose; tests stay quiet.
export const LOG_LEVEL_BY_ENV = {
  production: 'info',
  development: 'debug',
  test: 'silent',
} as const;

// pino redact paths (dot-notation, `*` matches one nesting level). Sensitive
// keys are replaced with the censor value even when a raw object is passed by
// mistake. Bare `name` is intentionally not listed - too many non-PII uses.
export const LOG_REDACT_PATHS = [
  'password',
  '*.password',
  'token',
  '*.token',
  'accessToken',
  '*.accessToken',
  'refreshToken',
  '*.refreshToken',
  'secret',
  '*.secret',
  'authorization',
  '*.authorization',
  'cookie',
  '*.cookie',
  'req.headers.authorization',
  'req.headers.cookie',
  'email',
  '*.email',
  'phone',
  '*.phone',
  'ship_phone',
  'recipient_name',
  '*.recipient_name',
  'ship_recipient_name',
  'address',
  '*.address',
  'address_line1',
  '*.address_line1',
  'address_line2',
  '*.address_line2',
  'ship_address_line1',
  'ship_address_line2',
  'postal_code',
  '*.postal_code',
  'ship_postal_code',
] as const;

export const LOG_REDACT_CENSOR = '[REDACTED]';

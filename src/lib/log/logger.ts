import pino from 'pino';
import 'server-only';

import { LOG_LEVEL_BY_ENV, LOG_REDACT_CENSOR, LOG_REDACT_PATHS } from '@/constants/log';
import { env } from '@/env';

// No transport: pino writes JSON lines straight to stdout, which the deploy
// platform's log collector picks up. Level labels and ISO timestamps are
// friendlier for aggregators than pino's numeric level / epoch defaults.
export const logger = pino({
  level: LOG_LEVEL_BY_ENV[env.NODE_ENV],
  redact: {
    paths: [...LOG_REDACT_PATHS],
    censor: LOG_REDACT_CENSOR,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export type Logger = typeof logger;

import pino from 'pino';
import 'server-only';

import { LOG_LEVEL_BY_ENV, LOG_REDACT_CENSOR, LOG_REDACT_PATHS } from '@/constants/log';
import { env } from '@/env';
import { getRequestContext } from '@/lib/log/request-context';

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
  // Stamp the active request's correlation id (and resolved actor) onto every
  // line, read from AsyncLocalStorage so call sites never thread it manually.
  mixin() {
    const context = getRequestContext();
    if (!context) {
      return {};
    }

    return {
      requestId: context.requestId,
      ...(context.consumerId === undefined ? {} : { consumerId: context.consumerId }),
      ...(context.adminId === undefined ? {} : { adminId: context.adminId }),
    };
  },
});

export type Logger = typeof logger;

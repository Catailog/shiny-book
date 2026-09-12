import * as Sentry from '@sentry/nextjs';

import { env } from '@/env';
import { scrubSentryEvent } from '@/lib/sentry/scrub-event';

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  // The wizard defaults this to true; CLAUDE.md 7절 bans PII in telemetry, so
  // it's turned off explicitly rather than trusting the default.
  sendDefaultPii: false,
  beforeSend: scrubSentryEvent,
  tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
});

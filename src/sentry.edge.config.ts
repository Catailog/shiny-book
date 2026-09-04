import * as Sentry from '@sentry/nextjs';

import { env } from '@/env';
import { scrubSentryEvent } from '@/lib/sentry/scrub-event';

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  beforeSend: scrubSentryEvent,
  tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
});

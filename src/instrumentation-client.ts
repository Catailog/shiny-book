import * as Sentry from '@sentry/nextjs';

import { env } from '@/env';
import { scrubSentryEvent } from '@/lib/sentry/scrub-event';

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  beforeSend: scrubSentryEvent,
  tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  // No replay/CaptureConsole integrations - session replay records real user
  // screens and console capture can carry arbitrary logged data; both are a
  // bigger PII surface than this project wants. Exception capture only.
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

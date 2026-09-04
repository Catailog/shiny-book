import type { ErrorEvent } from '@sentry/nextjs';

const SENSITIVE_HEADER_NAMES = new Set(['cookie', 'authorization']);

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
// Korean phone formats: 010-1234-5678, 02-123-4567, +82 10 1234 5678, etc.
const PHONE_PATTERN = /(?:\+?82[-.\s]?)?0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g;
const SCRUB_TOKEN = '[scrubbed]';

// CLAUDE.md 7절(로그/텔레메트리에 PII 원문 금지)이 Sentry SDK의 `sendDefaultPii`
// 기본 동작과 정면 충돌한다 - 마법사가 심는 기본값을 그대로 두면 안 된다. 세
// 진입점(instrumentation-client.ts, sentry.server.config.ts, sentry.edge.config.ts)
// 모두 이 함수를 beforeSend로 공유한다. 이벤트를 버리지 않고(null 반환 없음)
// 민감한 조각만 제거하거나 치환해 그대로 돌려준다.
export function scrubSentryEvent(event: ErrorEvent): ErrorEvent {
  if (event.request) {
    delete event.request.data;
    delete event.request.query_string;

    if (event.request.headers) {
      for (const key of Object.keys(event.request.headers)) {
        if (SENSITIVE_HEADER_NAMES.has(key.toLowerCase())) {
          delete event.request.headers[key];
        }
      }
    }
  }

  delete event.user;
  event.breadcrumbs = [];

  if (typeof event.message === 'string') {
    event.message = scrubText(event.message);
  }

  for (const exceptionValue of event.exception?.values ?? []) {
    if (typeof exceptionValue.value === 'string') {
      exceptionValue.value = scrubText(exceptionValue.value);
    }
  }

  return event;
}

function scrubText(value: string): string {
  return value.replace(EMAIL_PATTERN, SCRUB_TOKEN).replace(PHONE_PATTERN, SCRUB_TOKEN);
}

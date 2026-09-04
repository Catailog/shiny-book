import type { ErrorEvent } from '@sentry/nextjs';
import { describe, expect, it } from 'vitest';

import { scrubSentryEvent } from './scrub-event';

function buildEvent(overrides: Partial<ErrorEvent> = {}): ErrorEvent {
  return {
    type: undefined,
    message: 'something failed',
    ...overrides,
  };
}

describe('scrubSentryEvent', () => {
  it('removes the request body, query string, and sensitive headers', () => {
    const event = buildEvent({
      request: {
        data: { password: 'hunter2' },
        query_string: 'token=abc',
        headers: { cookie: 'sid=1', Authorization: 'Bearer x', 'user-agent': 'test-agent' },
      },
    });

    const scrubbed = scrubSentryEvent(event);

    expect(scrubbed.request?.data).toBeUndefined();
    expect(scrubbed.request?.query_string).toBeUndefined();
    expect(scrubbed.request?.headers?.cookie).toBeUndefined();
    expect(scrubbed.request?.headers?.Authorization).toBeUndefined();
    expect(scrubbed.request?.headers?.['user-agent']).toBe('test-agent');
  });

  it('removes event.user and clears breadcrumbs', () => {
    const event = buildEvent({
      user: { id: 'consumer-1', email: 'reader@example.com' },
      breadcrumbs: [{ message: 'clicked button' }],
    });

    const scrubbed = scrubSentryEvent(event);

    expect(scrubbed.user).toBeUndefined();
    expect(scrubbed.breadcrumbs).toEqual([]);
  });

  it('scrubs an email address out of the top-level message', () => {
    const event = buildEvent({ message: 'failed to notify reader@example.com about order' });

    const scrubbed = scrubSentryEvent(event);

    expect(scrubbed.message).toBe('failed to notify [scrubbed] about order');
  });

  it('scrubs a Korean phone number out of an exception value', () => {
    const event = buildEvent({
      message: undefined,
      exception: {
        values: [{ type: 'Error', value: 'contact was 010-1234-5678, retry failed' }],
      },
    });

    const scrubbed = scrubSentryEvent(event);

    expect(scrubbed.exception?.values?.[0]?.value).toBe('contact was [scrubbed], retry failed');
  });

  it('leaves an event with no PII-bearing fields unchanged', () => {
    const event = buildEvent({ message: 'plain failure with no PII' });

    const scrubbed = scrubSentryEvent(event);

    expect(scrubbed.message).toBe('plain failure with no PII');
  });
});

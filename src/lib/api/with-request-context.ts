import type { NextRequest } from 'next/server';

import 'server-only';

import { REQUEST_ID_HEADER } from '@/constants/log';
import { logger } from '@/lib/log/logger';
import { runWithRequestContext } from '@/lib/log/request-context';
import { resolveRequestId } from '@/lib/log/resolve-request-id';

// Wrap a Route Handler so every line it logs carries a correlation id, and the
// request/response pair is logged with method, path, status, and duration.
// `/api/*` needs this explicitly because `proxy.ts` does not run there.
export function withRequestContext<Args extends unknown[]>(
  handler: (request: NextRequest, ...args: Args) => Promise<Response>,
): (request: NextRequest, ...args: Args) => Promise<Response> {
  return (request, ...args) => {
    const requestId = resolveRequestId(request.headers.get(REQUEST_ID_HEADER));

    return runWithRequestContext({ requestId }, async () => {
      const startedAt = performance.now();
      const path = new URL(request.url).pathname;
      logger.info({ event: 'request.start', method: request.method, path }, 'request received');

      try {
        const response = await handler(request, ...args);
        response.headers.set(REQUEST_ID_HEADER, requestId);
        logger.info(
          {
            event: 'request.end',
            method: request.method,
            path,
            status: response.status,
            durationMs: Math.round(performance.now() - startedAt),
          },
          'request completed',
        );
        return response;
      } catch (error) {
        logger.error(
          {
            event: 'request.error',
            method: request.method,
            path,
            durationMs: Math.round(performance.now() - startedAt),
            err:
              error instanceof Error
                ? { message: error.message, stack: error.stack }
                : { value: String(error) },
          },
          'request threw',
        );
        throw error;
      }
    });
  };
}

import type { NextRequest } from 'next/server';

import type { ModelMessage } from 'ai';

import { API_ERROR_CODES } from '@/constants/api-errors';
import { buildKnowledgeBase } from '@/lib/ai/build-knowledge-base';
import { streamChatCompletion } from '@/lib/ai/chat-completion';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { apiError } from '@/lib/api/api-response';
import { withRequestContext } from '@/lib/api/with-request-context';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getLocale } from '@/lib/i18n/get-locale';
import { logger } from '@/lib/log/logger';
import { checkAiChatRateLimit } from '@/lib/rate-limit/ai-chat-rate-limit';
import { retryAfterSeconds } from '@/lib/rate-limit/photo-upload-rate-limit';
import { getClientIp } from '@/lib/request/get-client-ip';
import { aiChatRequestSchema } from '@/schemas/ai';

async function postHandler(request: NextRequest): Promise<Response> {
  const [clientIp, consumer] = await Promise.all([getClientIp(), getCurrentConsumer()]);

  const rateLimitKey = consumer ? `consumer:${consumer.id}` : `ip:${clientIp}`;
  const rateLimit = await checkAiChatRateLimit(rateLimitKey);
  if (!rateLimit.isAllowed) {
    return apiError(
      API_ERROR_CODES.RATE_LIMITED,
      `Rate limited. Retry in ${retryAfterSeconds(rateLimit.resetAt)}s`,
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = aiChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(API_ERROR_CODES.VALIDATION_FAILED, 'Invalid chat request');
  }

  const locale = await getLocale();
  const knowledgeBase = await buildKnowledgeBase(locale);
  const system = buildSystemPrompt(knowledgeBase, locale);

  const messages: ModelMessage[] = parsed.data.messages.map((message) =>
    message.role === 'user'
      ? { role: 'user' as const, content: message.content }
      : { role: 'assistant' as const, content: message.content },
  );

  const completion = await streamChatCompletion(system, messages);
  if (!completion) {
    logger.error({ event: 'ai.all_providers_failed' }, 'No AI provider produced a response');
    return apiError(API_ERROR_CODES.AI_UNAVAILABLE, 'The assistant is unavailable');
  }

  return new Response(completion.stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-AI-Provider': completion.provider,
    },
  });
}

export const POST = withRequestContext(postHandler);

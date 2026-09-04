import { type ModelMessage, streamText } from 'ai';
import 'server-only';

import {
  AI_MAX_OUTPUT_TOKENS,
  AI_PROVIDER_FALLBACK_ORDER,
  AI_REQUEST_TIMEOUT_MS,
  AI_TEMPERATURE,
  type AiProvider,
} from '@/constants/ai';
import { env } from '@/env';
import { resolveModel } from '@/lib/ai/resolve-model';
import { logger } from '@/lib/log/logger';

export interface ChatCompletionStream {
  provider: AiProvider;
  stream: ReadableStream<Uint8Array>;
}

function describeError(error: unknown): { message: string } | { value: string } {
  return error instanceof Error ? { message: error.message } : { value: String(error) };
}

// Try each configured provider in order. The AI SDK routes stream failures to
// `fullStream` as an `error` part instead of throwing, so we pull parts until the
// first text (commit to this provider) or the first error (fall through).
export async function streamChatCompletion(
  system: string,
  messages: ModelMessage[],
): Promise<ChatCompletionStream | null> {
  const credentials = {
    geminiApiKey: env.GEMINI_API_KEY,
    groqApiKey: env.GROQ_API_KEY,
    cloudflareAccountId: env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareApiToken: env.CLOUDFLARE_API_TOKEN,
  };

  for (const provider of AI_PROVIDER_FALLBACK_ORDER) {
    const model = resolveModel(provider, credentials);
    if (!model) {
      continue;
    }

    const result = streamText({
      model,
      system,
      messages,
      maxOutputTokens: AI_MAX_OUTPUT_TOKENS,
      temperature: AI_TEMPERATURE,
      maxRetries: 0,
      timeout: AI_REQUEST_TIMEOUT_MS,
      // Ignored by non-Google models. Keeps Gemini's reasoning from consuming the
      // output-token budget and drifting away from the reference material.
      providerOptions: { google: { thinkingConfig: { thinkingLevel: 'minimal' } } },
    });

    const iterator = result.fullStream[Symbol.asyncIterator]();

    let firstText: string | null = null;
    try {
      while (firstText === null) {
        const next = await iterator.next();
        if (next.done) {
          throw new Error('provider returned an empty stream');
        }
        if (next.value.type === 'error') {
          throw next.value.error;
        }
        if (next.value.type === 'text-delta') {
          firstText = next.value.text;
        }
      }
    } catch (error) {
      logger.warn(
        { event: 'ai.provider_failed', provider, err: describeError(error) },
        'AI provider failed before producing text, trying the next',
      );
      continue;
    }

    const committedFirstText = firstText;
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          if (committedFirstText.length > 0) {
            controller.enqueue(encoder.encode(committedFirstText));
          }
          while (true) {
            const next = await iterator.next();
            if (next.done) {
              break;
            }
            if (next.value.type === 'error') {
              throw next.value.error;
            }
            if (next.value.type === 'text-delta' && next.value.text.length > 0) {
              controller.enqueue(encoder.encode(next.value.text));
            }
          }
          controller.close();
        } catch (error) {
          logger.error(
            { event: 'ai.stream_interrupted', provider, err: describeError(error) },
            'AI response stream failed after it had started',
          );
          controller.error(error);
        }
      },
    });

    return { provider, stream };
  }

  return null;
}

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { type LanguageModel, type ModelMessage, streamText } from 'ai';
import 'server-only';

import {
  AI_MAX_OUTPUT_TOKENS,
  AI_MODEL,
  AI_PROVIDER,
  AI_PROVIDER_FALLBACK_ORDER,
  AI_REQUEST_TIMEOUT_MS,
  type AiProvider,
} from '@/constants/ai';
import { env } from '@/env';
import { logger } from '@/lib/log/logger';

export interface ChatCompletionStream {
  provider: AiProvider;
  stream: ReadableStream<Uint8Array>;
}

function resolveModel(provider: AiProvider): LanguageModel | null {
  switch (provider) {
    case AI_PROVIDER.GEMINI:
      return env.GOOGLE_AI_STUDIO_API_KEY
        ? createGoogleGenerativeAI({ apiKey: env.GOOGLE_AI_STUDIO_API_KEY })(AI_MODEL[provider])
        : null;
    case AI_PROVIDER.GROQ:
      return env.GROQ_API_KEY ? createGroq({ apiKey: env.GROQ_API_KEY })(AI_MODEL[provider]) : null;
    case AI_PROVIDER.CLOUDFLARE:
      return env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_WORKERS_AI_API_TOKEN
        ? createOpenAI({
            apiKey: env.CLOUDFLARE_WORKERS_AI_API_TOKEN,
            baseURL: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
          })(AI_MODEL[provider])
        : null;
  }
}

async function* restOfStream(iterator: AsyncIterator<string>): AsyncGenerator<string> {
  while (true) {
    const next = await iterator.next();
    if (next.done) {
      return;
    }
    if (next.value.length > 0) {
      yield next.value;
    }
  }
}

// Try each configured provider in order. A provider that rejects the request
// (auth, model, outage, rate limit) fails before its first token, so we can
// still fall through; once a provider yields a token we are committed to it.
export async function streamChatCompletion(
  system: string,
  messages: ModelMessage[],
): Promise<ChatCompletionStream | null> {
  for (const provider of AI_PROVIDER_FALLBACK_ORDER) {
    const model = resolveModel(provider);
    if (!model) {
      continue;
    }

    try {
      const result = streamText({
        model,
        system,
        messages,
        maxOutputTokens: AI_MAX_OUTPUT_TOKENS,
        maxRetries: 0,
        timeout: AI_REQUEST_TIMEOUT_MS,
      });

      const iterator = result.textStream[Symbol.asyncIterator]();
      const first = await iterator.next();

      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            if (!first.done && first.value.length > 0) {
              controller.enqueue(encoder.encode(first.value));
            }
            for await (const chunk of restOfStream(iterator)) {
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
          } catch (error) {
            logger.error(
              {
                event: 'ai.stream_interrupted',
                provider,
                err: error instanceof Error ? { message: error.message } : { value: String(error) },
              },
              'AI response stream failed after it had started',
            );
            controller.error(error);
          }
        },
      });

      return { provider, stream };
    } catch (error) {
      logger.warn(
        {
          event: 'ai.provider_failed',
          provider,
          err: error instanceof Error ? { message: error.message } : { value: String(error) },
        },
        'AI provider rejected the request, trying the next',
      );
    }
  }

  return null;
}

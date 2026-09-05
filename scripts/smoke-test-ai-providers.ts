// Actively checks each AI provider independently (not the fallback chain -
// that's the point: a dead provider behind a working one is invisible to
// users, so this pokes each one on its own before anyone hits it), plus the
// Gemini embedding model that vector search depends on separately from the
// chat fallback chain. Run locally with `npm run ai:canary`, or on a
// schedule via CI.
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { loadEnvConfig } from '@next/env';
import { embed, streamText } from 'ai';

import {
  AI_EMBEDDING_MODEL,
  AI_PROVIDER,
  AI_PROVIDER_FALLBACK_ORDER,
  AI_REQUEST_TIMEOUT_MS,
  type AiProvider,
} from '@/constants/ai';
import { classifyProviderError } from '@/lib/ai/classify-provider-error';
import { resolveModel } from '@/lib/ai/resolve-model';

loadEnvConfig(process.cwd());

const SMOKE_TEST_MAX_OUTPUT_TOKENS = 20;
const TRANSIENT_RETRY_DELAY_MS = 2_000;

type CheckResult = 'ok' | 'skipped' | 'transient' | 'structural';

const credentials = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN,
};

async function checkProvider(provider: AiProvider): Promise<CheckResult> {
  const model = resolveModel(provider, credentials);
  if (!model) {
    console.log(`[skip] ${provider}: no API key configured`);
    return 'skipped';
  }

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const result = streamText({
        model,
        system: 'Reply with a single short word.',
        messages: [{ role: 'user', content: 'Say hi.' }],
        maxOutputTokens: SMOKE_TEST_MAX_OUTPUT_TOKENS,
        maxRetries: 0,
        timeout: AI_REQUEST_TIMEOUT_MS,
        providerOptions: { google: { thinkingConfig: { thinkingLevel: 'minimal' } } },
      });

      const iterator = result.fullStream[Symbol.asyncIterator]();
      const first = await iterator.next();
      if (first.done) {
        throw new Error('provider returned an empty stream');
      }
      if (first.value.type === 'error') {
        throw first.value.error;
      }

      console.log(`[ok] ${provider}: responded`);
      return 'ok';
    } catch (error) {
      const { kind, errorClass } = classifyProviderError(provider, error);
      const message = error instanceof Error ? error.message : String(error);

      if (kind === 'structural') {
        console.error(`[fail] ${provider}: structural failure (${errorClass}) - ${message}`);
        return 'structural';
      }

      if (attempt === 1) {
        console.warn(`[retry] ${provider}: transient failure (${errorClass}), retrying once`);
        await new Promise((resolve) => setTimeout(resolve, TRANSIENT_RETRY_DELAY_MS));
        continue;
      }

      console.warn(
        `[warn] ${provider}: transient failure after retry (${errorClass}) - ${message}, not failing the job`,
      );
      return 'transient';
    }
  }

  return 'transient';
}

async function checkEmbedding(geminiApiKey: string | undefined): Promise<CheckResult> {
  if (!geminiApiKey) {
    console.log('[skip] embedding: no API key configured');
    return 'skipped';
  }

  const google = createGoogleGenerativeAI({ apiKey: geminiApiKey });
  const model = google.textEmbeddingModel(AI_EMBEDDING_MODEL);

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      await embed({ model, value: 'canary check' });
      console.log('[ok] embedding: responded');
      return 'ok';
    } catch (error) {
      const { kind, errorClass } = classifyProviderError(AI_PROVIDER.GEMINI, error);
      const message = error instanceof Error ? error.message : String(error);

      if (kind === 'structural') {
        console.error(`[fail] embedding: structural failure (${errorClass}) - ${message}`);
        return 'structural';
      }

      if (attempt === 1) {
        console.warn(`[retry] embedding: transient failure (${errorClass}), retrying once`);
        await new Promise((resolve) => setTimeout(resolve, TRANSIENT_RETRY_DELAY_MS));
        continue;
      }

      console.warn(
        `[warn] embedding: transient failure after retry (${errorClass}) - ${message}, not failing the job`,
      );
      return 'transient';
    }
  }

  return 'transient';
}

async function main() {
  const providers = [...AI_PROVIDER_FALLBACK_ORDER];
  const [results, embeddingResult] = await Promise.all([
    Promise.all(providers.map((provider) => checkProvider(provider))),
    checkEmbedding(credentials.geminiApiKey),
  ]);

  const structuralFailures: string[] = providers.filter(
    (_, index) => results[index] === 'structural',
  );
  if (embeddingResult === 'structural') {
    structuralFailures.push('embedding');
  }

  const checkedCount =
    providers.filter((_, index) => results[index] !== 'skipped').length +
    (embeddingResult === 'skipped' ? 0 : 1);

  if (checkedCount === 0) {
    console.warn('No provider API keys were configured - nothing was checked.');
  }

  if (structuralFailures.length > 0) {
    console.error(`\nStructural failures: ${structuralFailures.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  console.log('\nAll configured providers are healthy.');
}

main().catch((error) => {
  console.error('Smoke test crashed:', error);
  process.exitCode = 1;
});

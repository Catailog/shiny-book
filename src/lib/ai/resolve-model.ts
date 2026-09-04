import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

import { AI_MODEL, AI_PROVIDER, type AiProvider } from '@/constants/ai';

// Credentials are passed in rather than read from `@/env` here so this stays
// importable from the standalone CI canary script (scripts/smoke-test-ai-providers.ts),
// which has no Next.js server context to satisfy the `server-only` guard that
// chat-completion.ts carries.
export interface ProviderCredentials {
  geminiApiKey: string | undefined;
  groqApiKey: string | undefined;
  cloudflareAccountId: string | undefined;
  cloudflareApiToken: string | undefined;
}

export function resolveModel(
  provider: AiProvider,
  credentials: ProviderCredentials,
): LanguageModel | null {
  switch (provider) {
    case AI_PROVIDER.GEMINI:
      return credentials.geminiApiKey
        ? createGoogleGenerativeAI({ apiKey: credentials.geminiApiKey })(AI_MODEL[provider])
        : null;
    case AI_PROVIDER.GROQ:
      return credentials.groqApiKey
        ? createGroq({ apiKey: credentials.groqApiKey })(AI_MODEL[provider])
        : null;
    case AI_PROVIDER.CLOUDFLARE:
      // `.chat(...)` forces the OpenAI-compatible chat/completions endpoint;
      // the provider's default call signature targets the Responses API,
      // which Cloudflare's compat layer does not reliably support.
      return credentials.cloudflareAccountId && credentials.cloudflareApiToken
        ? createOpenAI({
            apiKey: credentials.cloudflareApiToken,
            baseURL: `https://api.cloudflare.com/client/v4/accounts/${credentials.cloudflareAccountId}/ai/v1`,
          }).chat(AI_MODEL[provider])
        : null;
  }
}

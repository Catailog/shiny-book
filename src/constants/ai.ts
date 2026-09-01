export const AI_PROVIDER = {
  GEMINI: 'gemini',
  GROQ: 'groq',
  CLOUDFLARE: 'cloudflare',
} as const;

export type AiProvider = (typeof AI_PROVIDER)[keyof typeof AI_PROVIDER];

// Try each provider in turn until one streams a response. Gemini first: best
// Korean and best at the "decline politely, redirect to inquiry" nuance for a
// Korean-primary support bot. Groq is the fast/cheap backup, Cloudflare the
// last resort.
export const AI_PROVIDER_FALLBACK_ORDER: readonly AiProvider[] = [
  AI_PROVIDER.GEMINI,
  AI_PROVIDER.GROQ,
  AI_PROVIDER.CLOUDFLARE,
];

// Model ids drift - keep them here so a bump is a one-line change.
export const AI_MODEL: Record<AiProvider, string> = {
  [AI_PROVIDER.GEMINI]: 'gemini-2.0-flash',
  [AI_PROVIDER.GROQ]: 'llama-3.1-8b-instant',
  [AI_PROVIDER.CLOUDFLARE]: '@cf/meta/llama-3.1-8b-instruct',
};

export const AI_MAX_OUTPUT_TOKENS = 800;
export const AI_REQUEST_TIMEOUT_MS = 30_000;

// The whole knowledge base is stuffed into the system prompt; truncate if the
// assembled text ever grows past this.
export const AI_KNOWLEDGE_BASE_MAX_CHARS = 40_000;

export const AI_MAX_HISTORY_MESSAGES = 20;
export const AI_MAX_MESSAGE_LENGTH = 2_000;

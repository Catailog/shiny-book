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

// Model ids drift - keep them here so a bump is a one-line change. Last
// verified 2026-09-02 (Groq deprecated its llama-3.x line on 2026-08-16 and
// points migrators at the gpt-oss models; Cloudflare deprecated
// @cf/meta/llama-3.1-8b-instruct on 2026-05-30; Gemini 2.x is retired in favor
// of the 3.x line).
export const AI_MODEL: Record<AiProvider, string> = {
  [AI_PROVIDER.GEMINI]: 'gemini-3.6-flash',
  [AI_PROVIDER.GROQ]: 'openai/gpt-oss-20b',
  [AI_PROVIDER.CLOUDFLARE]: '@cf/openai/gpt-oss-20b',
};

// gemini-3.6-flash is a "thinking" model: reasoning tokens draw from this same
// budget before any answer text is produced. Thinking is held to `minimal` at
// call time (near-zero reasoning tokens in practice), so this is mostly a
// runaway guard with wide headroom for a full multi-part support reply.
export const AI_MAX_OUTPUT_TOKENS = 3_000;
export const AI_REQUEST_TIMEOUT_MS = 30_000;

// Near-deterministic. A support bot should track the knowledge base, not improvise.
export const AI_TEMPERATURE = 0.2;

// The whole knowledge base is stuffed into the system prompt; truncate if the
// assembled text ever grows past this.
export const AI_KNOWLEDGE_BASE_MAX_CHARS = 40_000;

export const AI_MAX_HISTORY_MESSAGES = 20;
export const AI_MAX_MESSAGE_LENGTH = 2_000;

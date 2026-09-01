import { beforeEach, describe, expect, it, vi } from 'vitest';

const streamTextMock = vi.fn();
vi.mock('ai', () => ({ streamText: streamTextMock }));

vi.mock('@ai-sdk/google', () => ({ createGoogleGenerativeAI: () => () => 'gemini-model' }));
vi.mock('@ai-sdk/groq', () => ({ createGroq: () => () => 'groq-model' }));
vi.mock('@ai-sdk/openai', () => ({ createOpenAI: () => () => 'cf-model' }));

const mockKeys = {
  GOOGLE_AI_STUDIO_API_KEY: 'g' as string | undefined,
  GROQ_API_KEY: 'q' as string | undefined,
  CLOUDFLARE_ACCOUNT_ID: 'acc' as string | undefined,
  CLOUDFLARE_WORKERS_AI_API_TOKEN: 'tok' as string | undefined,
};
vi.mock('@/env', () => ({ env: mockKeys }));
vi.mock('@/lib/log/logger', () => ({ logger: { warn: vi.fn(), error: vi.fn() } }));

const { streamChatCompletion } = await import('@/lib/ai/chat-completion');

function textStreamOf(chunks: string[]) {
  return {
    textStream: {
      async *[Symbol.asyncIterator]() {
        for (const chunk of chunks) {
          yield chunk;
        }
      },
    },
  };
}

function failingTextStream() {
  return {
    textStream: {
      async *[Symbol.asyncIterator]() {
        throw new Error('provider rejected');
      },
    },
  };
}

async function readAll(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let out = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    out += decoder.decode(value);
  }
  return out;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockKeys.GOOGLE_AI_STUDIO_API_KEY = 'g';
  mockKeys.GROQ_API_KEY = 'q';
  mockKeys.CLOUDFLARE_ACCOUNT_ID = 'acc';
  mockKeys.CLOUDFLARE_WORKERS_AI_API_TOKEN = 'tok';
});

describe('streamChatCompletion', () => {
  it('uses the first provider that yields a token', async () => {
    streamTextMock.mockReturnValueOnce(textStreamOf(['Hel', 'lo']));

    const result = await streamChatCompletion('sys', []);

    expect(result?.provider).toBe('gemini');
    expect(await readAll(result!.stream)).toBe('Hello');
    expect(streamTextMock).toHaveBeenCalledTimes(1);
  });

  it('falls through to the next provider when one rejects before the first token', async () => {
    streamTextMock
      .mockReturnValueOnce(failingTextStream())
      .mockReturnValueOnce(textStreamOf(['from groq']));

    const result = await streamChatCompletion('sys', []);

    expect(result?.provider).toBe('groq');
    expect(await readAll(result!.stream)).toBe('from groq');
    expect(streamTextMock).toHaveBeenCalledTimes(2);
  });

  it('skips providers whose keys are missing', async () => {
    mockKeys.GOOGLE_AI_STUDIO_API_KEY = undefined;
    streamTextMock.mockReturnValueOnce(textStreamOf(['groq only']));

    const result = await streamChatCompletion('sys', []);

    expect(result?.provider).toBe('groq');
    expect(streamTextMock).toHaveBeenCalledTimes(1);
  });

  it('returns null when every provider fails', async () => {
    streamTextMock.mockReturnValue(failingTextStream());

    expect(await streamChatCompletion('sys', [])).toBeNull();
    expect(streamTextMock).toHaveBeenCalledTimes(3);
  });

  it('returns null when no provider keys are configured', async () => {
    mockKeys.GOOGLE_AI_STUDIO_API_KEY = undefined;
    mockKeys.GROQ_API_KEY = undefined;
    mockKeys.CLOUDFLARE_ACCOUNT_ID = undefined;

    expect(await streamChatCompletion('sys', [])).toBeNull();
    expect(streamTextMock).not.toHaveBeenCalled();
  });
});

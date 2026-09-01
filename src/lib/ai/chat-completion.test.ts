import { beforeEach, describe, expect, it, vi } from 'vitest';

const streamTextMock = vi.fn();
vi.mock('ai', () => ({ streamText: streamTextMock }));

vi.mock('@ai-sdk/google', () => ({ createGoogleGenerativeAI: () => () => 'gemini-model' }));
vi.mock('@ai-sdk/groq', () => ({ createGroq: () => () => 'groq-model' }));
vi.mock('@ai-sdk/openai', () => ({ createOpenAI: () => ({ chat: () => 'cf-model' }) }));

const mockKeys = {
  GEMINI_API_KEY: 'g' as string | undefined,
  GROQ_API_KEY: 'q' as string | undefined,
  CLOUDFLARE_ACCOUNT_ID: 'acc' as string | undefined,
  CLOUDFLARE_API_TOKEN: 'tok' as string | undefined,
};
vi.mock('@/env', () => ({ env: mockKeys }));
vi.mock('@/lib/log/logger', () => ({ logger: { warn: vi.fn(), error: vi.fn() } }));

const { streamChatCompletion } = await import('@/lib/ai/chat-completion');

function fullStreamOf(parts: unknown[]) {
  return {
    fullStream: {
      async *[Symbol.asyncIterator]() {
        for (const part of parts) {
          yield part;
        }
      },
    },
  };
}

function textParts(...texts: string[]) {
  return texts.map((text) => ({ type: 'text-delta', text }));
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
  mockKeys.GEMINI_API_KEY = 'g';
  mockKeys.GROQ_API_KEY = 'q';
  mockKeys.CLOUDFLARE_ACCOUNT_ID = 'acc';
  mockKeys.CLOUDFLARE_API_TOKEN = 'tok';
});

describe('streamChatCompletion', () => {
  it('uses the first provider that produces text', async () => {
    streamTextMock.mockReturnValueOnce(fullStreamOf(textParts('Hel', 'lo')));

    const result = await streamChatCompletion('sys', []);

    expect(result?.provider).toBe('gemini');
    expect(await readAll(result!.stream)).toBe('Hello');
    expect(streamTextMock).toHaveBeenCalledTimes(1);
    expect(streamTextMock.mock.calls[0]?.[0]).toMatchObject({
      temperature: 0.2,
      providerOptions: { google: { thinkingConfig: { thinkingLevel: 'minimal' } } },
    });
  });

  it('falls through when a provider emits an error part before any text', async () => {
    streamTextMock
      .mockReturnValueOnce(fullStreamOf([{ type: 'error', error: new Error('model_not_found') }]))
      .mockReturnValueOnce(fullStreamOf(textParts('from groq')));

    const result = await streamChatCompletion('sys', []);

    expect(result?.provider).toBe('groq');
    expect(await readAll(result!.stream)).toBe('from groq');
    expect(streamTextMock).toHaveBeenCalledTimes(2);
  });

  it('falls through on an empty stream', async () => {
    streamTextMock
      .mockReturnValueOnce(fullStreamOf([]))
      .mockReturnValueOnce(fullStreamOf(textParts('groq text')));

    const result = await streamChatCompletion('sys', []);

    expect(result?.provider).toBe('groq');
  });

  it('skips providers whose keys are missing', async () => {
    mockKeys.GEMINI_API_KEY = undefined;
    streamTextMock.mockReturnValueOnce(fullStreamOf(textParts('groq only')));

    const result = await streamChatCompletion('sys', []);

    expect(result?.provider).toBe('groq');
    expect(streamTextMock).toHaveBeenCalledTimes(1);
  });

  it('returns null when every provider fails', async () => {
    streamTextMock.mockReturnValue(fullStreamOf([{ type: 'error', error: new Error('down') }]));

    expect(await streamChatCompletion('sys', [])).toBeNull();
    expect(streamTextMock).toHaveBeenCalledTimes(3);
  });

  it('returns null when no provider keys are configured', async () => {
    mockKeys.GEMINI_API_KEY = undefined;
    mockKeys.GROQ_API_KEY = undefined;
    mockKeys.CLOUDFLARE_ACCOUNT_ID = undefined;

    expect(await streamChatCompletion('sys', [])).toBeNull();
    expect(streamTextMock).not.toHaveBeenCalled();
  });
});

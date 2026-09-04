import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/env', () => ({ env: { GEMINI_API_KEY: 'test-key' } }));

const loggerMock = { info: vi.fn(), warn: vi.fn() };
vi.mock('@/lib/log/logger', () => ({ logger: loggerMock }));

const buildKnowledgeBaseMock = vi.fn().mockResolvedValue('full knowledge base');
vi.mock('@/lib/ai/build-knowledge-base', () => ({
  buildKnowledgeBase: buildKnowledgeBaseMock,
}));

const embedMock = vi.fn();
vi.mock('ai', () => ({ embed: embedMock }));

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: () => ({
    textEmbeddingModel: () => 'embedding-model',
  }),
}));

const rpcMock = vi.fn();
vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({ rpc: rpcMock }),
}));

const { retrieveContext } = await import('./retrieve-context');

beforeEach(() => {
  vi.clearAllMocks();
  buildKnowledgeBaseMock.mockResolvedValue('full knowledge base');
  embedMock.mockResolvedValue({ embedding: [0.1, 0.2, 0.3] });
});

describe('retrieveContext', () => {
  it('falls back to the full knowledge base when there is no last user message', async () => {
    const result = await retrieveContext('ko', '');

    expect(result).toBe('full knowledge base');
    expect(embedMock).not.toHaveBeenCalled();
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it('joins the matched chunk contents on a successful search', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [{ content: 'chunk one' }, { content: 'chunk two' }],
      error: null,
    });

    const result = await retrieveContext('ko', '배송은 얼마나 걸리나요?');

    expect(result).toBe('chunk one\n\nchunk two');
    expect(rpcMock).toHaveBeenCalledWith('match_knowledge_chunks', {
      query_embedding: JSON.stringify([0.1, 0.2, 0.3]),
      match_locale: 'ko',
      match_count: expect.any(Number),
      min_similarity: expect.any(Number),
    });
    expect(buildKnowledgeBaseMock).not.toHaveBeenCalled();
  });

  it('falls back to the full knowledge base when the search returns no rows', async () => {
    rpcMock.mockResolvedValueOnce({ data: [], error: null });

    const result = await retrieveContext('ko', '배송은 얼마나 걸리나요?');

    expect(result).toBe('full knowledge base');
  });

  it('falls back to the full knowledge base when the search errors', async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: { message: 'db error' } });

    const result = await retrieveContext('ko', '배송은 얼마나 걸리나요?');

    expect(result).toBe('full knowledge base');
  });

  it('falls back to the full knowledge base and logs a warning when embedding throws', async () => {
    embedMock.mockRejectedValueOnce(new Error('provider unavailable'));

    const result = await retrieveContext('ko', '배송은 얼마나 걸리나요?');

    expect(result).toBe('full knowledge base');
    expect(loggerMock.warn).toHaveBeenCalledWith(
      expect.anything(),
      'Vector retrieval failed, falling back to the full knowledge base',
    );
  });
});

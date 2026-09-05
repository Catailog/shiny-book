import { beforeEach, describe, expect, it, vi } from 'vitest';

const collectKnowledgeChunksMock = vi.fn();
vi.mock('@/lib/ai/collect-knowledge-chunks', () => ({
  collectKnowledgeChunks: collectKnowledgeChunksMock,
}));

const getStoredKnowledgeChunksMock = vi.fn();
vi.mock('@/lib/ai/stored-knowledge-chunks', () => ({
  getStoredKnowledgeChunks: getStoredKnowledgeChunksMock,
}));

const { getKnowledgeBaseStatus } = await import('./get-knowledge-base-status');

function chunk(chunkKey: string, content: string) {
  return { chunkKey, source: 'faq' as const, sourceRef: chunkKey, locale: null, content };
}

function stored(chunkKey: string, content: string, updatedAt: string) {
  return { chunk_key: chunkKey, content, updated_at: updatedAt };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getKnowledgeBaseStatus', () => {
  it('reports not stale and the latest updated_at when nothing changed', async () => {
    collectKnowledgeChunksMock.mockResolvedValue([chunk('faq:1:all', 'hello')]);
    getStoredKnowledgeChunksMock.mockResolvedValue([
      stored('faq:1:all', 'hello', '2026-01-05T00:00:00.000Z'),
    ]);

    const status = await getKnowledgeBaseStatus();

    expect(status).toEqual({
      lastAppliedAt: '2026-01-05T00:00:00.000Z',
      isStale: false,
      addedCount: 0,
      changedCount: 0,
      removedCount: 0,
    });
  });

  it('reports stale with counts when chunks were added, changed, and removed', async () => {
    collectKnowledgeChunksMock.mockResolvedValue([
      chunk('faq:1:all', 'unchanged'),
      chunk('faq:2:all', 'edited answer'),
      chunk('faq:3:all', 'new faq'),
    ]);
    getStoredKnowledgeChunksMock.mockResolvedValue([
      stored('faq:1:all', 'unchanged', '2026-01-01T00:00:00.000Z'),
      stored('faq:2:all', 'old answer', '2026-01-02T00:00:00.000Z'),
      stored('product:deleted-product:ko', 'gone', '2026-01-03T00:00:00.000Z'),
    ]);

    const status = await getKnowledgeBaseStatus();

    expect(status).toEqual({
      lastAppliedAt: '2026-01-03T00:00:00.000Z',
      isStale: true,
      addedCount: 1,
      changedCount: 1,
      removedCount: 1,
    });
  });

  it('reports null lastAppliedAt when the knowledge base has never been indexed', async () => {
    collectKnowledgeChunksMock.mockResolvedValue([chunk('faq:1:all', 'hello')]);
    getStoredKnowledgeChunksMock.mockResolvedValue([]);

    const status = await getKnowledgeBaseStatus();

    expect(status.lastAppliedAt).toBeNull();
    expect(status.isStale).toBe(true);
  });
});

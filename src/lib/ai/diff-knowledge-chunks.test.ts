import { describe, expect, it } from 'vitest';

import type { KnowledgeChunk } from '@/lib/ai/collect-knowledge-chunks';
import { diffKnowledgeChunks } from '@/lib/ai/diff-knowledge-chunks';
import type { StoredKnowledgeChunkSummary } from '@/lib/ai/stored-knowledge-chunks';

function chunk(chunkKey: string, content: string): KnowledgeChunk {
  return { chunkKey, source: 'faq', sourceRef: chunkKey, locale: null, content };
}

function stored(chunkKey: string, content: string): StoredKnowledgeChunkSummary {
  return { chunk_key: chunkKey, content, updated_at: '2026-01-01T00:00:00.000Z' };
}

describe('diffKnowledgeChunks', () => {
  it('treats every fresh chunk as unchanged when content matches exactly', () => {
    const fresh = [chunk('faq:1:all', 'hello'), chunk('faq:2:all', 'world')];
    const storedChunks = [stored('faq:1:all', 'hello'), stored('faq:2:all', 'world')];

    const diff = diffKnowledgeChunks(fresh, storedChunks);

    expect(diff.added).toEqual([]);
    expect(diff.changed).toEqual([]);
    expect(diff.removedKeys).toEqual([]);
    expect(diff.unchangedCount).toBe(2);
  });

  it('classifies a chunk with no stored counterpart as added', () => {
    const fresh = [chunk('faq:1:all', 'hello')];

    const diff = diffKnowledgeChunks(fresh, []);

    expect(diff.added).toEqual(fresh);
    expect(diff.changed).toEqual([]);
    expect(diff.unchangedCount).toBe(0);
  });

  it('classifies a chunk whose content changed as changed', () => {
    const fresh = [chunk('faq:1:all', 'updated answer')];
    const storedChunks = [stored('faq:1:all', 'old answer')];

    const diff = diffKnowledgeChunks(fresh, storedChunks);

    expect(diff.added).toEqual([]);
    expect(diff.changed).toEqual(fresh);
    expect(diff.unchangedCount).toBe(0);
  });

  it('lists a stored chunk key with no fresh counterpart in removedKeys', () => {
    const storedChunks = [stored('faq:1:all', 'hello'), stored('faq:2:all', 'removed')];
    const fresh = [chunk('faq:1:all', 'hello')];

    const diff = diffKnowledgeChunks(fresh, storedChunks);

    expect(diff.added).toEqual([]);
    expect(diff.changed).toEqual([]);
    expect(diff.removedKeys).toEqual(['faq:2:all']);
    expect(diff.unchangedCount).toBe(1);
  });
});

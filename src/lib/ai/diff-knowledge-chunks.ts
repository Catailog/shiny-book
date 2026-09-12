import type { KnowledgeChunk } from '@/lib/ai/collect-knowledge-chunks';
import type { StoredKnowledgeChunkSummary } from '@/lib/ai/stored-knowledge-chunks';

export interface KnowledgeChunkDiff {
  added: KnowledgeChunk[];
  changed: KnowledgeChunk[];
  removedKeys: string[];
  unchangedCount: number;
}

// Compares what the knowledge base should contain right now (collectKnowledgeChunks)
// against what's actually stored, so callers only pay to embed/write what changed -
// an added FAQ or an edited product shows up here, an untouched chunk doesn't.
// added/changed are split (rather than one combined list) because the knowledge
// base status page reports them separately; reindexing itself treats both the same.
export function diffKnowledgeChunks(
  freshChunks: KnowledgeChunk[],
  storedChunks: StoredKnowledgeChunkSummary[],
): KnowledgeChunkDiff {
  const storedContentByKey = new Map(storedChunks.map((chunk) => [chunk.chunk_key, chunk.content]));
  const freshKeys = new Set(freshChunks.map((chunk) => chunk.chunkKey));

  const added: KnowledgeChunk[] = [];
  const changed: KnowledgeChunk[] = [];
  for (const chunk of freshChunks) {
    if (!storedContentByKey.has(chunk.chunkKey)) {
      added.push(chunk);
    } else if (storedContentByKey.get(chunk.chunkKey) !== chunk.content) {
      changed.push(chunk);
    }
  }

  const removedKeys = storedChunks
    .map((chunk) => chunk.chunk_key)
    .filter((key) => !freshKeys.has(key));

  return {
    added,
    changed,
    removedKeys,
    unchangedCount: freshChunks.length - added.length - changed.length,
  };
}

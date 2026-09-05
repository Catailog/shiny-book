import type { KnowledgeChunk } from '@/lib/ai/collect-knowledge-chunks';
import type { StoredKnowledgeChunkSummary } from '@/lib/ai/stored-knowledge-chunks';

export interface KnowledgeChunkDiff {
  toEmbed: KnowledgeChunk[];
  toDeleteKeys: string[];
  unchangedCount: number;
}

// Compares what the knowledge base should contain right now (collectKnowledgeChunks)
// against what's actually stored, so callers only pay to embed/write what changed -
// an added FAQ or an edited product shows up here, an untouched chunk doesn't.
export function diffKnowledgeChunks(
  freshChunks: KnowledgeChunk[],
  storedChunks: StoredKnowledgeChunkSummary[],
): KnowledgeChunkDiff {
  const storedContentByKey = new Map(storedChunks.map((chunk) => [chunk.chunk_key, chunk.content]));
  const freshKeys = new Set(freshChunks.map((chunk) => chunk.chunkKey));

  const toEmbed = freshChunks.filter(
    (chunk) => storedContentByKey.get(chunk.chunkKey) !== chunk.content,
  );
  const toDeleteKeys = storedChunks
    .map((chunk) => chunk.chunk_key)
    .filter((key) => !freshKeys.has(key));

  return {
    toEmbed,
    toDeleteKeys,
    unchangedCount: freshChunks.length - toEmbed.length,
  };
}

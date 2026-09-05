import 'server-only';

import { collectKnowledgeChunks } from '@/lib/ai/collect-knowledge-chunks';
import { diffKnowledgeChunks } from '@/lib/ai/diff-knowledge-chunks';
import { getStoredKnowledgeChunks } from '@/lib/ai/stored-knowledge-chunks';

export interface KnowledgeBaseStatus {
  lastAppliedAt: string | null;
  isStale: boolean;
  addedCount: number;
  changedCount: number;
  removedCount: number;
}

// Read-only: never calls the embedding API or writes to knowledge_chunks.
// Reuses the same diff reindexKnowledgeBase runs, so "needs update" here always
// agrees with what an actual reindex would do.
export async function getKnowledgeBaseStatus(): Promise<KnowledgeBaseStatus> {
  const [chunks, stored] = await Promise.all([
    collectKnowledgeChunks(),
    getStoredKnowledgeChunks(),
  ]);
  const { added, changed, removedKeys } = diffKnowledgeChunks(chunks, stored);

  const lastAppliedAt = stored.reduce<string | null>((latest, chunk) => {
    return latest === null || chunk.updated_at > latest ? chunk.updated_at : latest;
  }, null);

  return {
    lastAppliedAt,
    isStale: added.length > 0 || changed.length > 0 || removedKeys.length > 0,
    addedCount: added.length,
    changedCount: changed.length,
    removedCount: removedKeys.length,
  };
}

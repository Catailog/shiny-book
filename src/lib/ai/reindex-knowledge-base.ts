import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embedMany } from 'ai';
import 'server-only';

import { AI_EMBEDDING_MODEL } from '@/constants/ai';
import { env } from '@/env';
import { collectKnowledgeChunks } from '@/lib/ai/collect-knowledge-chunks';
import { diffKnowledgeChunks } from '@/lib/ai/diff-knowledge-chunks';
import { getStoredKnowledgeChunks } from '@/lib/ai/stored-knowledge-chunks';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface ReindexKnowledgeBaseResult {
  chunkCount: number;
  embeddedCount: number;
  deletedCount: number;
}

// Rebuilds the knowledge_chunks table from collectKnowledgeChunks (the same
// sources buildKnowledgeBase reads), so vector retrieval and the full-context
// fallback never diverge. Diffs against what's already stored first and only
// embeds/writes the chunks that actually changed - an unchanged knowledge base
// costs zero embedding calls and zero writes. Returns null when there is no
// embedding key configured to run this with.
export async function reindexKnowledgeBase(): Promise<ReindexKnowledgeBaseResult | null> {
  if (!env.GEMINI_API_KEY) {
    return null;
  }

  const [chunks, stored] = await Promise.all([
    collectKnowledgeChunks(),
    getStoredKnowledgeChunks(),
  ]);
  const { toEmbed, toDeleteKeys } = diffKnowledgeChunks(chunks, stored);

  const supabase = createServiceRoleClient();

  if (toDeleteKeys.length > 0) {
    const { error: deleteError } = await supabase
      .from('knowledge_chunks')
      .delete()
      .in('chunk_key', toDeleteKeys);
    if (deleteError) {
      throw deleteError;
    }
  }

  if (toEmbed.length === 0) {
    return { chunkCount: chunks.length, embeddedCount: 0, deletedCount: toDeleteKeys.length };
  }

  const google = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY });
  const model = google.textEmbeddingModel(AI_EMBEDDING_MODEL);
  const { embeddings } = await embedMany({ model, values: toEmbed.map((chunk) => chunk.content) });

  const now = new Date().toISOString();
  const rows = toEmbed.map((chunk, index) => ({
    chunk_key: chunk.chunkKey,
    source: chunk.source,
    source_ref: chunk.sourceRef,
    locale: chunk.locale,
    content: chunk.content,
    embedding: JSON.stringify(embeddings[index]),
    updated_at: now,
  }));

  const { error: upsertError } = await supabase
    .from('knowledge_chunks')
    .upsert(rows, { onConflict: 'chunk_key' });
  if (upsertError) {
    throw upsertError;
  }

  return {
    chunkCount: chunks.length,
    embeddedCount: rows.length,
    deletedCount: toDeleteKeys.length,
  };
}

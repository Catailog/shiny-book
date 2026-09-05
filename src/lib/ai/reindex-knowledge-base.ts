import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embedMany } from 'ai';
import 'server-only';

import { AI_EMBEDDING_MODEL } from '@/constants/ai';
import { env } from '@/env';
import { collectKnowledgeChunks } from '@/lib/ai/collect-knowledge-chunks';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface ReindexKnowledgeBaseResult {
  chunkCount: number;
}

// Rebuilds the knowledge_chunks table from collectKnowledgeChunks (the same
// sources buildKnowledgeBase reads), so vector retrieval and the full-context
// fallback never diverge. Returns null when there is no embedding key
// configured to run this with.
export async function reindexKnowledgeBase(): Promise<ReindexKnowledgeBaseResult | null> {
  if (!env.GEMINI_API_KEY) {
    return null;
  }

  const chunks = await collectKnowledgeChunks();
  if (chunks.length === 0) {
    return { chunkCount: 0 };
  }

  const google = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY });
  const model = google.textEmbeddingModel(AI_EMBEDDING_MODEL);
  const { embeddings } = await embedMany({ model, values: chunks.map((chunk) => chunk.content) });

  const now = new Date().toISOString();
  const rows = chunks.map((chunk, index) => ({
    chunk_key: chunk.chunkKey,
    source: chunk.source,
    source_ref: chunk.sourceRef,
    locale: chunk.locale,
    content: chunk.content,
    embedding: JSON.stringify(embeddings[index]),
    updated_at: now,
  }));

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('knowledge_chunks')
    .upsert(rows, { onConflict: 'chunk_key' });

  if (error) {
    throw error;
  }

  return { chunkCount: rows.length };
}

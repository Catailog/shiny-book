import 'server-only';

import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface StoredKnowledgeChunkSummary {
  chunk_key: string;
  content: string;
  updated_at: string;
}

// Selects only chunk_key/content/updated_at - never the embedding column, which
// is the heaviest one and unnecessary for diffing against fresh chunks or
// reading the "last applied" timestamp.
export async function getStoredKnowledgeChunks(): Promise<StoredKnowledgeChunkSummary[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('knowledge_chunks')
    .select('chunk_key, content, updated_at');

  if (error) {
    throw error;
  }

  return data;
}

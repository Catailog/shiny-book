import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embed } from 'ai';
import 'server-only';

import {
  AI_EMBEDDING_DIMENSIONS,
  AI_EMBEDDING_MODEL,
  AI_RETRIEVAL_MIN_SIMILARITY,
  AI_RETRIEVAL_TOP_K,
} from '@/constants/ai';
import { env } from '@/env';
import { buildKnowledgeBase } from '@/lib/ai/build-knowledge-base';
import { logger } from '@/lib/log/logger';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { Locale } from '@/locales';

// Vector search over knowledge_chunks, scoped to the top-K most relevant
// pieces for the user's last message instead of the whole corpus. Falls back
// to the full-context builder whenever retrieval can't produce a confident
// answer set - the assistant should never go quiet because retrieval failed.
export async function retrieveContext(locale: Locale, lastUserMessage: string): Promise<string> {
  if (!env.GEMINI_API_KEY || lastUserMessage.trim().length === 0) {
    return buildKnowledgeBase(locale);
  }

  try {
    const google = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY });
    const model = google.textEmbeddingModel(AI_EMBEDDING_MODEL);
    const { embedding } = await embed({
      model,
      value: lastUserMessage,
      providerOptions: {
        google: { outputDimensionality: AI_EMBEDDING_DIMENSIONS, taskType: 'RETRIEVAL_QUERY' },
      },
    });

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.rpc('match_knowledge_chunks', {
      query_embedding: JSON.stringify(embedding),
      match_locale: locale,
      match_count: AI_RETRIEVAL_TOP_K,
      min_similarity: AI_RETRIEVAL_MIN_SIMILARITY,
    });

    if (error || !data || data.length === 0) {
      return buildKnowledgeBase(locale);
    }

    return data.map((chunk) => chunk.content).join('\n\n');
  } catch (error) {
    logger.warn(
      {
        event: 'ai.retrieve_context_failed',
        err: error instanceof Error ? error.message : 'unknown',
      },
      'Vector retrieval failed, falling back to the full knowledge base',
    );
    return buildKnowledgeBase(locale);
  }
}

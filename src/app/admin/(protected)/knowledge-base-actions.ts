'use server';

import { reindexKnowledgeBase } from '@/lib/ai/reindex-knowledge-base';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { logger } from '@/lib/log/logger';

export interface ReindexKnowledgeBaseState {
  error: 'unauthorized' | 'not_configured' | 'failed' | null;
  chunkCount?: number;
}

export async function reindexKnowledgeBaseAction(): Promise<ReindexKnowledgeBaseState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: 'unauthorized' };
  }

  try {
    const result = await reindexKnowledgeBase();
    if (result === null) {
      return { error: 'not_configured' };
    }

    return { error: null, chunkCount: result.chunkCount };
  } catch (error) {
    logger.error(
      {
        event: 'ai.knowledge_base_reindex_failed',
        err: error instanceof Error ? error.message : 'unknown',
      },
      'Knowledge base reindex failed',
    );
    return { error: 'failed' };
  }
}

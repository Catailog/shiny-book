import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embedMany } from 'ai';
import 'server-only';

import {
  AI_EMBEDDING_MODEL,
  KNOWLEDGE_CHUNK_SOURCE,
  type KnowledgeChunkSource,
} from '@/constants/ai';
import { env } from '@/env';
import { ANNOUNCEMENT_LIMIT, FAQ_LIMIT, POLICY_SECTIONS } from '@/lib/ai/build-knowledge-base';
import { buildPricingFacts } from '@/lib/ai/build-pricing-facts';
import { flattenLocaleSection } from '@/lib/ai/flatten-locale-section';
import { getAnnouncements } from '@/lib/announcements/get-announcements';
import { getFaqs } from '@/lib/faqs/get-faqs';
import { getProductCatalog } from '@/lib/products/get-product-catalog';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { type Locale, locales } from '@/locales';

const RETRIEVAL_LOCALES: readonly Locale[] = ['ko', 'en'];

export interface ReindexKnowledgeBaseResult {
  chunkCount: number;
}

// Rebuilds the knowledge_chunks table from the same sources buildKnowledgeBase
// reads (see FAQ_LIMIT/ANNOUNCEMENT_LIMIT/POLICY_SECTIONS re-exported from
// there), so vector retrieval and the full-context fallback never diverge.
// Returns null when there is no embedding key configured to run this with.
export async function reindexKnowledgeBase(): Promise<ReindexKnowledgeBaseResult | null> {
  if (!env.GEMINI_API_KEY) {
    return null;
  }

  const chunks = await collectChunks();
  if (chunks.length === 0) {
    return { chunkCount: 0 };
  }

  const google = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY });
  const model = google.textEmbeddingModel(AI_EMBEDDING_MODEL);
  const { embeddings } = await embedMany({ model, values: chunks.map((chunk) => chunk.content) });

  const now = new Date().toISOString();
  const rows = chunks.map((chunk, index) => ({
    chunk_key: buildChunkKey(chunk),
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

interface KnowledgeChunkInput {
  source: KnowledgeChunkSource;
  sourceRef: string | null;
  locale: Locale | null;
  content: string;
}

async function collectChunks(): Promise<KnowledgeChunkInput[]> {
  const chunks: KnowledgeChunkInput[] = [
    {
      source: KNOWLEDGE_CHUNK_SOURCE.PRICING,
      sourceRef: null,
      locale: null,
      content: buildPricingFacts(),
    },
  ];

  const [faqs, announcements] = await Promise.all([
    getFaqs(FAQ_LIMIT),
    getAnnouncements(ANNOUNCEMENT_LIMIT),
  ]);

  for (const faq of faqs) {
    chunks.push({
      source: KNOWLEDGE_CHUNK_SOURCE.FAQ,
      sourceRef: faq.id,
      locale: null,
      content: `[[faq:${faq.id}]] Q: ${faq.question}\nA: ${faq.answer}`,
    });
  }

  for (const announcement of announcements) {
    chunks.push({
      source: KNOWLEDGE_CHUNK_SOURCE.ANNOUNCEMENT,
      sourceRef: announcement.id,
      locale: null,
      content: `[[notice:${announcement.id}]] [${announcement.title}] ${announcement.content}`,
    });
  }

  for (const locale of RETRIEVAL_LOCALES) {
    const t = locales[locale];
    const products = await getProductCatalog(locale);

    for (const product of products) {
      chunks.push({
        source: KNOWLEDGE_CHUNK_SOURCE.PRODUCT,
        sourceRef: product.slug,
        locale,
        content: `[${product.name}] ${product.price}, ${product.size}, ${product.category}\n${product.description}`,
      });
    }

    for (const section of POLICY_SECTIONS) {
      const text = flattenLocaleSection(t[section.key]);
      if (text.trim().length === 0) {
        continue;
      }
      const slug = section.route.replace(/^\//, '');
      chunks.push({
        source: KNOWLEDGE_CHUNK_SOURCE.POLICY,
        sourceRef: slug,
        locale,
        content: `[[page:${slug}]] ${text}`,
      });
    }
  }

  return chunks;
}

function buildChunkKey(chunk: KnowledgeChunkInput): string {
  return `${chunk.source}:${chunk.sourceRef ?? 'none'}:${chunk.locale ?? 'all'}`;
}

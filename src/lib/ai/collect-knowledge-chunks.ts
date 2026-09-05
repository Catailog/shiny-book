import 'server-only';

import { KNOWLEDGE_CHUNK_SOURCE, type KnowledgeChunkSource } from '@/constants/ai';
import { ANNOUNCEMENT_LIMIT, FAQ_LIMIT, POLICY_SECTIONS } from '@/lib/ai/build-knowledge-base';
import { buildPricingFacts } from '@/lib/ai/build-pricing-facts';
import { flattenLocaleSection } from '@/lib/ai/flatten-locale-section';
import { getAnnouncements } from '@/lib/announcements/get-announcements';
import { getFaqs } from '@/lib/faqs/get-faqs';
import { getProductCatalog } from '@/lib/products/get-product-catalog';
import { type Locale, locales } from '@/locales';

const RETRIEVAL_LOCALES: readonly Locale[] = ['ko', 'en'];

export interface KnowledgeChunkInput {
  source: KnowledgeChunkSource;
  sourceRef: string | null;
  locale: Locale | null;
  content: string;
}

export interface KnowledgeChunk extends KnowledgeChunkInput {
  chunkKey: string;
}

// Same sources buildKnowledgeBase reads (FAQ_LIMIT/ANNOUNCEMENT_LIMIT/POLICY_SECTIONS
// re-exported from there), so vector retrieval and the full-context fallback never
// diverge. Shared by reindexing and the staleness check so both agree on exactly
// what the knowledge base should contain right now.
export async function collectKnowledgeChunks(): Promise<KnowledgeChunk[]> {
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

  return chunks.map((chunk) => ({ ...chunk, chunkKey: buildChunkKey(chunk) }));
}

function buildChunkKey(chunk: KnowledgeChunkInput): string {
  return `${chunk.source}:${chunk.sourceRef ?? 'none'}:${chunk.locale ?? 'all'}`;
}

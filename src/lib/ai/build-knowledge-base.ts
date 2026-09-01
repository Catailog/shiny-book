import 'server-only';

import { AI_KNOWLEDGE_BASE_MAX_CHARS } from '@/constants/ai';
import { MARKETING_ROUTES } from '@/constants/routes';
import { buildPricingFacts } from '@/lib/ai/build-pricing-facts';
import { flattenLocaleSection } from '@/lib/ai/flatten-locale-section';
import { getAnnouncements } from '@/lib/announcements/get-announcements';
import { getFaqs } from '@/lib/faqs/get-faqs';
import { logger } from '@/lib/log/logger';
import { getProductCatalog } from '@/lib/products/get-product-catalog';
import { type Locale, locales } from '@/locales';

const FAQ_LIMIT = 100;
const ANNOUNCEMENT_LIMIT = 30;

// Locale sections that describe pricing and policies, each with the marketing
// page a [[page:<slug>]] citation should link to.
const POLICY_SECTIONS = [
  { key: 'pricing', route: MARKETING_ROUTES.PRICING },
  { key: 'layoutGuidelines', route: MARKETING_ROUTES.LAYOUT_GUIDELINES },
  { key: 'ecoPapers', route: MARKETING_ROUTES.ECO_PAPERS },
  { key: 'sustainability', route: MARKETING_ROUTES.SUSTAINABILITY },
  { key: 'shippingPolicy', route: MARKETING_ROUTES.SHIPPING_POLICY },
] as const;

// Assemble everything the support assistant is allowed to answer from into one
// block of text, which is stuffed into the system prompt (the corpus is small).
export async function buildKnowledgeBase(locale: Locale): Promise<string> {
  const [faqs, announcements, products] = await Promise.all([
    getFaqs(FAQ_LIMIT),
    getAnnouncements(ANNOUNCEMENT_LIMIT),
    getProductCatalog(locale),
  ]);
  const t = locales[locale];

  const sections: string[] = [];

  if (products.length > 0) {
    sections.push(
      `## 상품\n${products
        .map(
          (product) =>
            `[${product.name}] ${product.price}, ${product.size}, ${product.category}\n${product.description}`,
        )
        .join('\n\n')}`,
    );
  }

  sections.push(buildPricingFacts());

  if (faqs.length > 0) {
    sections.push(
      `## FAQ\n${faqs
        .map((faq) => `[[faq:${faq.id}]] Q: ${faq.question}\nA: ${faq.answer}`)
        .join('\n\n')}`,
    );
  }

  if (announcements.length > 0) {
    sections.push(
      `## 공지\n${announcements
        .map(
          (announcement) =>
            `[[notice:${announcement.id}]] [${announcement.title}] ${announcement.content}`,
        )
        .join('\n\n')}`,
    );
  }

  const policyEntries = POLICY_SECTIONS.map((section) => ({
    slug: section.route.replace(/^\//, ''),
    text: flattenLocaleSection(t[section.key]),
  })).filter((entry) => entry.text.trim().length > 0);
  if (policyEntries.length > 0) {
    sections.push(
      `## 정책/안내\n${policyEntries
        .map((entry) => `[[page:${entry.slug}]] ${entry.text}`)
        .join('\n\n')}`,
    );
  }

  const knowledgeBase = sections.join('\n\n');

  if (knowledgeBase.length > AI_KNOWLEDGE_BASE_MAX_CHARS) {
    logger.warn(
      { event: 'ai.knowledge_base_truncated', length: knowledgeBase.length },
      'AI knowledge base exceeded the size limit and was truncated',
    );
    return knowledgeBase.slice(0, AI_KNOWLEDGE_BASE_MAX_CHARS);
  }

  return knowledgeBase;
}

import 'server-only';

import {
  PHOTOBOOK_PAGE_COUNT_MAX,
  PHOTOBOOK_PAGE_COUNT_MIN,
  PHOTOBOOK_PAGE_COUNT_STEP,
} from '@/constants/photobook';
import { PRICING, SHIPPING } from '@/constants/pricing';

// The concrete pricing numbers live in @/constants and appear in no locale, so
// without this the knowledge base carries the pricing narrative but none of the
// figures. Model-facing text. Mirrors the published /pricing page table.
export function buildPricingFacts(): string {
  const won = (value: number) => `${value.toLocaleString('ko-KR')} won`;

  return [
    '## 가격 계산',
    `Photo-book length: ${PHOTOBOOK_PAGE_COUNT_MIN} to ${PHOTOBOOK_PAGE_COUNT_MAX} pages, chosen in steps of ${PHOTOBOOK_PAGE_COUNT_STEP} pages.`,
    `Per-page add-on: ${won(PRICING.PRICE_PER_PAGE_KRW)} for every page.`,
    `Merchandise price = (the product's base price + page count x ${won(PRICING.PRICE_PER_PAGE_KRW)}) x quantity. Each product's base price is in the 상품 section above.`,
    'Shipping fee:',
    `- Standard: ${won(SHIPPING.BASE_FEE_KRW)}.`,
    `- Jeju: additional ${won(SHIPPING.JEJU_SURCHARGE_KRW)}.`,
    `- Remote areas: additional ${won(SHIPPING.REMOTE_AREA_SURCHARGE_KRW)}.`,
    `- Free when the merchandise price is ${won(SHIPPING.FREE_SHIPPING_THRESHOLD_KRW)} or more.`,
    'Order total = merchandise price (minus any coupon discount) + shipping fee.',
  ].join('\n');
}

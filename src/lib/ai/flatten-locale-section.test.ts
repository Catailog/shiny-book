import { describe, expect, it } from 'vitest';

import { flattenLocaleSection } from '@/lib/ai/flatten-locale-section';

describe('flattenLocaleSection', () => {
  it('returns a string leaf as-is', () => {
    expect(flattenLocaleSection('hello')).toBe('hello');
  });

  it('joins nested object and array string leaves with newlines', () => {
    const section = {
      title: '가격 안내',
      intro: '아래 표를 참고하세요.',
      tiers: [
        { name: '스탠다드', price: '30,000원' },
        { name: '프리미엄', price: '50,000원' },
      ],
    };

    expect(flattenLocaleSection(section)).toBe(
      ['가격 안내', '아래 표를 참고하세요.', '스탠다드', '30,000원', '프리미엄', '50,000원'].join(
        '\n',
      ),
    );
  });

  it('skips non-string leaves and empty strings', () => {
    expect(flattenLocaleSection({ a: 5, b: null, c: '', d: 'keep' })).toBe('keep');
  });

  it('returns an empty string for a primitive non-string', () => {
    expect(flattenLocaleSection(42)).toBe('');
    expect(flattenLocaleSection(null)).toBe('');
  });
});

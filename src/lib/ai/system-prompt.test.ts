import { describe, expect, it } from 'vitest';

import { buildSystemPrompt } from '@/lib/ai/system-prompt';

describe('buildSystemPrompt', () => {
  it('embeds the knowledge base and asks for a Korean reply for the ko locale', () => {
    const prompt = buildSystemPrompt('Q: 배송?\nA: 3일', 'ko');
    expect(prompt).toContain('Q: 배송?\nA: 3일');
    expect(prompt).toContain('Reply in Korean');
    expect(prompt).toContain('inquiry (문의)');
    expect(prompt).toContain('exact figures and wording');
  });

  it('asks for an English reply for the en locale', () => {
    expect(buildSystemPrompt('kb', 'en')).toContain('Reply in English');
  });
});

import { describe, expect, it } from 'vitest';

import { AI_MAX_HISTORY_MESSAGES, AI_MAX_MESSAGE_LENGTH } from '@/constants/ai';
import { aiChatRequestSchema } from '@/schemas/ai';

describe('aiChatRequestSchema', () => {
  it('accepts a valid message list', () => {
    const result = aiChatRequestSchema.safeParse({
      messages: [
        { role: 'user', content: '  배송 얼마나 걸려요?  ' },
        { role: 'assistant', content: '보통 3일입니다.' },
      ],
    });
    expect(result.success && result.data.messages[0]?.content).toBe('배송 얼마나 걸려요?');
  });

  it('rejects an empty message list', () => {
    expect(aiChatRequestSchema.safeParse({ messages: [] }).success).toBe(false);
  });

  it('rejects an unknown role', () => {
    expect(
      aiChatRequestSchema.safeParse({ messages: [{ role: 'system', content: 'x' }] }).success,
    ).toBe(false);
  });

  it('rejects a message that is blank or over the length limit', () => {
    expect(
      aiChatRequestSchema.safeParse({ messages: [{ role: 'user', content: '   ' }] }).success,
    ).toBe(false);
    expect(
      aiChatRequestSchema.safeParse({
        messages: [{ role: 'user', content: 'a'.repeat(AI_MAX_MESSAGE_LENGTH + 1) }],
      }).success,
    ).toBe(false);
  });

  it('rejects more than the history limit', () => {
    const messages = Array.from({ length: AI_MAX_HISTORY_MESSAGES + 1 }, () => ({
      role: 'user' as const,
      content: 'hi',
    }));
    expect(aiChatRequestSchema.safeParse({ messages }).success).toBe(false);
  });
});

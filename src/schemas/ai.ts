import { z } from 'zod';

import { AI_MAX_HISTORY_MESSAGES, AI_MAX_MESSAGE_LENGTH } from '@/constants/ai';

const aiChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(AI_MAX_MESSAGE_LENGTH),
});

export const aiChatRequestSchema = z.object({
  messages: z.array(aiChatMessageSchema).min(1).max(AI_MAX_HISTORY_MESSAGES),
});

export type AiChatRequest = z.infer<typeof aiChatRequestSchema>;
export type AiChatMessage = z.infer<typeof aiChatMessageSchema>;

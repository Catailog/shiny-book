'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AI_MAX_HISTORY_MESSAGES, AI_MAX_MESSAGE_LENGTH } from '@/constants/ai';
import { API_ROUTES, CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';
import { getApiErrorMessage } from '@/lib/i18n/get-api-error-message';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AiChatPanel() {
  const t = useT();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (trimmed.length === 0 || isStreaming) {
      return;
    }

    const history = [
      ...messages,
      { id: crypto.randomUUID(), role: 'user' as const, content: trimmed },
    ];
    const assistantId = crypto.randomUUID();
    setMessages([...history, { id: assistantId, role: 'assistant', content: '' }]);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch(API_ROUTES.AI_CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history
            .slice(-AI_MAX_HISTORY_MESSAGES)
            .map((message) => ({ role: message.role, content: message.content })),
        }),
      });

      if (!response.ok || !response.body) {
        const payload: unknown = await response.json().catch(() => null);
        const code =
          typeof payload === 'object' && payload !== null && 'error' in payload
            ? (payload as { error: { code?: unknown } }).error?.code
            : undefined;
        toast.error(getApiErrorMessage(t, code));
        setMessages(history);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId ? { ...message, content: message.content + chunk } : message,
          ),
        );
      }

      setMessages((current) => {
        const answered = current.find((message) => message.id === assistantId);
        if (answered && answered.content.trim().length === 0) {
          toast.error(t.ai.errorMessage);
          return history;
        }
        return current;
      });
    } catch {
      toast.error(t.ai.errorMessage);
      setMessages(history);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  const lastMessage = messages.at(-1);
  const isWaitingForFirstToken =
    isStreaming && lastMessage?.role === 'assistant' && lastMessage.content.length === 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-1">
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-foreground">{t.ai.greeting}</p>

        {messages.map((message) => (
          <p
            key={message.id}
            className={cn(
              'max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap',
              message.role === 'user'
                ? 'ml-auto bg-primary text-primary-foreground'
                : 'bg-muted text-foreground',
            )}
          >
            {message.content}
          </p>
        ))}

        {isWaitingForFirstToken ? (
          <p className="w-fit animate-pulse rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            {t.ai.thinking}
          </p>
        ) : null}
      </div>

      <div className="space-y-2 border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          {t.ai.inquiryPrompt}{' '}
          <Link href={CONSUMER_ROUTES.INQUIRIES} className="underline underline-offset-2">
            {t.ai.inquiryLink}
          </Link>
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void sendMessage();
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={AI_MAX_MESSAGE_LENGTH}
            rows={1}
            placeholder={t.ai.inputPlaceholder}
            aria-label={t.ai.inputPlaceholder}
            className="max-h-32 min-h-11 flex-1 resize-none"
          />
          <Button
            type="submit"
            size="icon-lg"
            variant="primary"
            disabled={isStreaming || input.trim().length === 0}
            aria-label={t.ai.sendLabel}
          >
            <ArrowUp aria-hidden="true" className="size-5" />
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">{t.ai.disclaimer}</p>
      </div>
    </div>
  );
}

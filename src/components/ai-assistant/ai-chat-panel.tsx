'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { ArrowUp, BookOpen, Info, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AI_MAX_HISTORY_MESSAGES, AI_MAX_MESSAGE_LENGTH } from '@/constants/ai';
import { API_ROUTES, CONSUMER_ROUTES, FAQ_ROUTES, NOTICE_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';
import { getApiErrorMessage } from '@/lib/i18n/get-api-error-message';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type SourceKind = 'faq' | 'notice';

interface MessageSource {
  kind: SourceKind;
  id: string;
}

const SOURCE_MARKER = /\[\[(faq|notice):([0-9a-fA-F-]+)\]\]/g;
const TRAILING_PARTIAL_MARKER = /\[\[?[a-z]*:?[0-9a-fA-F-]*\]?\]?\s*$/;

// Persist for the browser tab only: survives closing/reopening the drawer and
// navigating within the tab, and is discarded when the tab closes.
const HISTORY_STORAGE_KEY = 'shiny-book:ai-chat';

function isChatMessage(value: unknown): value is ChatMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ChatMessage).id === 'string' &&
    ((value as ChatMessage).role === 'user' || (value as ChatMessage).role === 'assistant') &&
    typeof (value as ChatMessage).content === 'string'
  );
}

function loadHistory(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter(isChatMessage) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]): void {
  try {
    if (messages.length === 0) {
      sessionStorage.removeItem(HISTORY_STORAGE_KEY);
    } else {
      sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(messages));
    }
  } catch {
    // Storage unavailable (private mode / quota) - fall back to in-memory only.
  }
}

function extractSources(raw: string): { text: string; sources: MessageSource[] } {
  const sources: MessageSource[] = [];
  const text = raw
    .replace(SOURCE_MARKER, (_full, kind: string, id: string) => {
      const normalizedKind: SourceKind = kind === 'faq' ? 'faq' : 'notice';
      if (!sources.some((source) => source.kind === normalizedKind && source.id === id)) {
        sources.push({ kind: normalizedKind, id });
      }
      return '';
    })
    .replace(TRAILING_PARTIAL_MARKER, '')
    .trimEnd();

  return { text, sources };
}

export function AiChatPanel() {
  const t = useT();
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    typeof window === 'undefined' ? [] : loadHistory(),
  );
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveHistory(messages);
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
      {messages.length > 0 ? (
        <button
          type="button"
          onClick={() => setMessages([])}
          className="self-end text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          {t.ai.clearChat}
        </button>
      ) : null}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-1">
        <p className="w-fit max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm break-words text-foreground">
          {t.ai.greeting}
        </p>

        {messages.map((message) => {
          if (message.role === 'user') {
            return (
              <p
                key={message.id}
                className="ml-auto w-fit max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm break-words whitespace-pre-wrap text-primary-foreground"
              >
                {message.content}
              </p>
            );
          }

          if (message.content.length === 0) {
            return null;
          }

          const { text, sources } = extractSources(message.content);
          return (
            <div key={message.id} className="space-y-1.5">
              <p className="w-fit max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm break-words whitespace-pre-wrap text-foreground">
                {text}
              </p>
              {sources.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {sources.map((source) => (
                    <Link
                      key={`${source.kind}-${source.id}`}
                      href={
                        source.kind === 'faq'
                          ? `${FAQ_ROUTES.LIST}#${source.id}`
                          : `${NOTICE_ROUTES.LIST}/${source.id}`
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <BookOpen aria-hidden="true" className="size-3" />
                      {source.kind === 'faq' ? t.ai.sourceFaq : t.ai.sourceNotice}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        {isWaitingForFirstToken ? <TypingIndicator label={t.ai.thinking} /> : null}
      </div>

      <div className="space-y-2 border-t border-border pt-3">
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
            className="max-h-32 min-h-11 flex-1 resize-none py-2.5"
          />
          <Button
            type="submit"
            size="icon"
            variant="primary"
            disabled={isStreaming || input.trim().length === 0}
            aria-label={t.ai.sendLabel}
            className="size-11 shrink-0"
          >
            <ArrowUp aria-hidden="true" className="size-5" />
          </Button>
        </form>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="flex items-start gap-1.5">
            <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span>
              {t.ai.inquiryPrompt}{' '}
              <Link
                href={CONSUMER_ROUTES.INQUIRIES}
                className="font-medium text-foreground underline underline-offset-2"
              >
                {t.ai.inquiryLink}
              </Link>
            </span>
          </p>
          <p className="flex items-start gap-1.5">
            <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span>{t.ai.disclaimer}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ label }: { label: string }) {
  return (
    <span
      role="status"
      className="flex w-fit items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground"
    >
      <span aria-hidden="true" className="flex items-center gap-1">
        <span className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground" />
        <span className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground [animation-delay:0.2s]" />
        <span className="size-1.5 animate-typing-dot rounded-full bg-muted-foreground [animation-delay:0.4s]" />
      </span>
      {label}
    </span>
  );
}

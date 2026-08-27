'use client';

import { useLayoutEffect, useRef, useState, useTransition } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import { useT } from '@/hooks/use-t';
import type { Tables } from '@/lib/db/database.types';
import { formatDateTime } from '@/lib/format-date';

import { addConsumerMessage, loadOlderInquiryMessages } from './actions';

interface InquiryMessageThreadProps {
  inquiryId: string;
  initialMessages: Tables<'inquiry_messages'>[];
  initialHasMore: boolean;
}

export function InquiryMessageThread({
  inquiryId,
  initialMessages,
  initialHasMore,
}: InquiryMessageThreadProps) {
  const t = useT();
  const [messages, setMessages] = useState(initialMessages);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [content, setContent] = useState('');
  const [isLoadingOlder, startLoadOlderTransition] = useTransition();
  const [isSending, startSendTransition] = useTransition();
  const scrollHeightBeforeLoadRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (scrollHeightBeforeLoadRef.current === null) {
      return;
    }

    const previousScrollHeight = scrollHeightBeforeLoadRef.current;
    scrollHeightBeforeLoadRef.current = null;
    const newScrollHeight = document.documentElement.scrollHeight;
    window.scrollTo(0, window.scrollY + (newScrollHeight - previousScrollHeight));
  }, [messages]);

  function handleLoadOlder() {
    const oldestMessage = messages[0];
    if (!oldestMessage) {
      return;
    }

    scrollHeightBeforeLoadRef.current = document.documentElement.scrollHeight;
    startLoadOlderTransition(async () => {
      const page = await loadOlderInquiryMessages(inquiryId, oldestMessage.created_at);
      setMessages((current) => [...page.messages, ...current]);
      setHasMore(page.hasMore);
    });
  }

  function handleSend() {
    if (content.trim().length === 0) {
      return;
    }

    startSendTransition(async () => {
      const result = await addConsumerMessage(inquiryId, { content });
      if ('errorCode' in result) {
        toast.error(t.consumer.inquiries.errors[result.errorCode]);
        return;
      }

      setMessages((current) => [...current, result.message]);
      setContent('');
    });
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {hasMore ? (
        <button
          type="button"
          onClick={handleLoadOlder}
          disabled={isLoadingOlder}
          className="self-center text-sm font-medium text-muted-foreground underline disabled:opacity-50"
        >
          {isLoadingOlder
            ? t.consumer.inquiries.loadingOlderMessages
            : t.consumer.inquiries.loadOlderMessages}
        </button>
      ) : null}
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.author_type === INQUIRY_MESSAGE_AUTHOR.ADMIN
              ? 'flex flex-col gap-1 rounded-lg border border-primary/30 bg-primary-soft/40 p-4'
              : 'flex flex-col gap-1 rounded-lg bg-muted p-4'
          }
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-muted-foreground">
              {message.author_type === INQUIRY_MESSAGE_AUTHOR.ADMIN
                ? t.consumer.inquiries.adminAuthorLabel
                : t.consumer.inquiries.consumerAuthorLabel}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(message.created_at)}
            </span>
          </div>
          <p className="text-sm [overflow-wrap:anywhere] break-words whitespace-pre-wrap text-foreground">
            {message.content}
          </p>
        </div>
      ))}

      <div className="mt-2 flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">
          {t.consumer.inquiries.threadLabel}
        </span>
        <Textarea
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={t.consumer.inquiries.replyPlaceholder}
        />
        <Button
          type="button"
          variant="primary"
          disabled={isSending}
          className="w-fit"
          onClick={handleSend}
        >
          {isSending ? t.consumer.inquiries.replying : t.consumer.inquiries.replyButton}
        </Button>
      </div>
    </div>
  );
}

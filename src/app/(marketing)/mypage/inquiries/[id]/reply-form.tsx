'use client';

import { useState, useTransition } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useT } from '@/hooks/use-t';

import { addConsumerMessage } from './actions';

interface ReplyFormProps {
  inquiryId: string;
}

export function ReplyForm({ inquiryId }: ReplyFormProps) {
  const t = useT();
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (content.trim().length === 0) {
      return;
    }

    startTransition(async () => {
      const result = await addConsumerMessage(inquiryId, { content });
      if (result) {
        toast.error(t.consumer.inquiries.errors[result.errorCode]);
        return;
      }
      setContent('');
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        rows={4}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={t.consumer.inquiries.replyPlaceholder}
      />
      <Button
        type="button"
        variant="primary"
        disabled={isPending}
        className="w-fit"
        onClick={handleSubmit}
      >
        {isPending ? t.consumer.inquiries.replying : t.consumer.inquiries.replyButton}
      </Button>
    </div>
  );
}

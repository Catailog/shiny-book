'use client';

import { useState, useTransition } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { defaultLocale, locales } from '@/locales';

import { addAdminMessage } from '../actions';

interface ReplyFormProps {
  inquiryId: string;
}

export function ReplyForm({ inquiryId }: ReplyFormProps) {
  const t = locales[defaultLocale];
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (content.trim().length === 0) {
      return;
    }

    startTransition(async () => {
      const result = await addAdminMessage(inquiryId, { content });
      if (result) {
        toast.error(t.admin.inquiries.errors[result.errorCode]);
        return;
      }
      toast.success(t.admin.inquiries.answerSuccess);
      setContent('');
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        rows={4}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={t.admin.inquiries.detail.replyPlaceholder}
        className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <Button type="button" disabled={isPending} className="w-fit" onClick={handleSubmit}>
        {isPending ? t.admin.inquiries.answering : t.admin.inquiries.answerButton}
      </Button>
    </div>
  );
}

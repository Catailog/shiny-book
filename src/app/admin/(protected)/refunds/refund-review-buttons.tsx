'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { REFUND_REVIEW_NOTE_MAX_LENGTH } from '@/constants/refund';
import { defaultLocale, locales } from '@/locales';

import { approveRefund, rejectRefund, retryRefund } from './refund-review-actions';

interface RefundReviewButtonsProps {
  refundRequestId: string;
  pending: boolean;
  failed: boolean;
}

type Mode = 'approve' | 'reject';

export function RefundReviewButtons({
  refundRequestId,
  pending,
  failed,
}: RefundReviewButtonsProps) {
  const t = locales[defaultLocale];
  const router = useRouter();
  const [mode, setMode] = useState<Mode | null>(null);
  const [note, setNote] = useState('');
  const [isPending, startTransition] = useTransition();

  function close() {
    setMode(null);
    setNote('');
  }

  function runReview(currentMode: Mode) {
    startTransition(async () => {
      const action = currentMode === 'approve' ? approveRefund : rejectRefund;
      const result = await action(refundRequestId, note.trim() ? { note: note.trim() } : {});
      if (result.errorCode) {
        toast.error(t.admin.refunds.review.errors[result.errorCode]);
        return;
      }
      toast.success(t.admin.refunds.review.success[currentMode]);
      close();
      router.refresh();
    });
  }

  function runRetry() {
    startTransition(async () => {
      const result = await retryRefund(refundRequestId);
      if (result.errorCode) {
        toast.error(t.admin.refunds.review.errors[result.errorCode]);
        return;
      }
      toast.success(t.admin.refunds.review.success.retry);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {pending ? (
        <>
          <Button type="button" size="sm" onClick={() => setMode('approve')}>
            {t.admin.refunds.review.approveButton}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setMode('reject')}>
            {t.admin.refunds.review.rejectButton}
          </Button>
        </>
      ) : null}
      {failed ? (
        <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={runRetry}>
          {t.admin.refunds.review.retryButton}
        </Button>
      ) : null}

      <Dialog open={mode !== null} onOpenChange={(open) => (open ? null : close())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === 'approve'
                ? t.admin.refunds.review.approveTitle
                : t.admin.refunds.review.rejectTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="refund-review-note">{t.admin.refunds.review.noteLabel}</Label>
            <Textarea
              id="refund-review-note"
              value={note}
              rows={3}
              maxLength={REFUND_REVIEW_NOTE_MAX_LENGTH}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              {t.admin.refunds.review.cancel}
            </Button>
            <Button
              type="button"
              disabled={isPending}
              variant={mode === 'reject' ? 'destructive' : 'default'}
              onClick={() => mode && runReview(mode)}
            >
              {mode === 'approve'
                ? t.admin.refunds.review.approveConfirm
                : t.admin.refunds.review.rejectConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

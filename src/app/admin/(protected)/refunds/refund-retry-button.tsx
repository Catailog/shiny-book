'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { defaultLocale, locales } from '@/locales';

import { retryRefund } from './refund-retry-action';

interface RefundRetryButtonProps {
  refundRequestId: string;
}

export function RefundRetryButton({ refundRequestId }: RefundRetryButtonProps) {
  const t = locales[defaultLocale];
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(async () => {
      const result = await retryRefund(refundRequestId);
      if (result.errorCode) {
        toast.error(t.admin.refunds.retry.errors[result.errorCode]);
        return;
      }
      toast.success(t.admin.refunds.retry.success);
      router.refresh();
    });
  }

  return (
    <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={handleRetry}>
      {t.admin.refunds.retry.button}
    </Button>
  );
}

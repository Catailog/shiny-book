'use client';

import { useTransition } from 'react';

import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { defaultLocale, locales } from '@/locales';

import { reindexKnowledgeBaseAction } from './knowledge-base-actions';

export function ReindexKnowledgeBaseButton() {
  const t = locales[defaultLocale];
  const [isPending, startTransition] = useTransition();

  function handleReindex() {
    startTransition(async () => {
      const result = await reindexKnowledgeBaseAction();
      if (result.error) {
        toast.error(t.admin.knowledgeBase.errors[result.error]);
        return;
      }

      const embeddedCount = result.embeddedCount ?? 0;
      const deletedCount = result.deletedCount ?? 0;
      if (embeddedCount === 0 && deletedCount === 0) {
        toast.success(t.admin.knowledgeBase.successNoChange);
        return;
      }

      toast.success(
        t.admin.knowledgeBase.successUpdated
          .replace('{embedded}', String(embeddedCount))
          .replace('{deleted}', String(deletedCount)),
      );
    });
  }

  return (
    <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleReindex}>
      <RefreshCw aria-hidden="true" className="size-4" />
      {isPending ? t.admin.knowledgeBase.reindexing : t.admin.knowledgeBase.reindexButton}
    </Button>
  );
}

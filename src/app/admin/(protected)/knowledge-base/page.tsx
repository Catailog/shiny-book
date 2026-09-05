import { RelativeDate } from '@/components/relative-date';
import { Badge } from '@/components/ui/badge';
import { getKnowledgeBaseStatus } from '@/lib/ai/get-knowledge-base-status';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from '../admin-topbar';
import { ReindexKnowledgeBaseButton } from '../reindex-knowledge-base-button';

export default async function AdminKnowledgeBasePage() {
  const t = locales[defaultLocale];
  const status = await getKnowledgeBaseStatus();

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.knowledgeBase.title} actions={<ReindexKnowledgeBaseButton />} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <p className="max-w-2xl text-sm text-muted-foreground">
          {t.admin.knowledgeBase.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-input-background p-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              {t.admin.knowledgeBase.lastAppliedLabel}
            </span>
            <span className="text-sm font-medium text-foreground">
              {status.lastAppliedAt ? (
                <RelativeDate value={status.lastAppliedAt} locale={defaultLocale} />
              ) : (
                t.admin.knowledgeBase.lastAppliedNever
              )}
            </span>
          </div>

          <Badge variant={status.isStale ? 'destructive' : 'secondary'}>
            {status.isStale
              ? t.admin.knowledgeBase.staleBadge
              : t.admin.knowledgeBase.upToDateBadge}
          </Badge>

          {status.isStale ? (
            <span className="text-sm text-muted-foreground">
              {t.admin.knowledgeBase.staleSummary
                .replace('{added}', String(status.addedCount))
                .replace('{changed}', String(status.changedCount))
                .replace('{removed}', String(status.removedCount))}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

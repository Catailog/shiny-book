'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

import { AnnouncementCategoryBadge } from '@/components/announcement-category-badge';
import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HOME_NOTICE_TICKER_PAGE_SIZE } from '@/constants/announcement';
import { NOTICE_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';
import type { Tables } from '@/lib/db/database.types';
import { cn } from '@/lib/utils';

const ROTATE_INTERVAL_MS = 5000;

interface NoticeTickerProps {
  notices: Tables<'announcements'>[];
}

export function NoticeTicker({ notices }: NoticeTickerProps) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (notices.length <= 1) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % notices.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [notices.length]);

  if (notices.length === 0) {
    return null;
  }

  const pageCount = Math.ceil(notices.length / HOME_NOTICE_TICKER_PAGE_SIZE);
  const pagedNotices = notices.slice(
    page * HOME_NOTICE_TICKER_PAGE_SIZE,
    page * HOME_NOTICE_TICKER_PAGE_SIZE + HOME_NOTICE_TICKER_PAGE_SIZE,
  );
  // notices.length > 0 is guaranteed by the early return above.
  const firstNotice = notices[0]!;
  const activeNotice = notices[index] ?? firstNotice;

  return (
    <Collapsible
      open={expanded}
      onOpenChange={setExpanded}
      className="border-b border-border bg-muted/40"
    >
      <div>
        <SiteContainer className="flex items-center justify-between gap-4 py-3">
          <Link
            href={`${NOTICE_ROUTES.LIST}/${activeNotice.id}`}
            className="flex min-w-0 flex-1 items-center gap-2 text-sm text-foreground hover:underline"
          >
            <AnnouncementCategoryBadge category={activeNotice.category} />
            <span className="truncate">{activeNotice.title}</span>
          </Link>
          <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
            {new Date(activeNotice.created_at).toLocaleDateString('ko-KR')}
          </span>
          <div className="flex items-center gap-1">
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t.site.home.notices.expandLabel}
                />
              }
            >
              <ChevronDown className={cn('transition-transform', expanded && 'rotate-180')} />
            </CollapsibleTrigger>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={<Link href={NOTICE_ROUTES.LIST} />}
                    nativeButton={false}
                    aria-label={t.site.home.notices.more}
                  />
                }
              >
                <Plus />
              </TooltipTrigger>
              <TooltipContent>{t.site.home.notices.more}</TooltipContent>
            </Tooltip>
          </div>
        </SiteContainer>
      </div>
      <CollapsibleContent>
        <SiteContainer className="flex flex-col gap-2 border-t border-border py-3">
          <ul className="flex flex-col divide-y divide-border">
            {pagedNotices.map((notice) => (
              <li key={notice.id}>
                <Link
                  href={`${NOTICE_ROUTES.LIST}/${notice.id}`}
                  className="flex items-center justify-between gap-4 py-2 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <AnnouncementCategoryBadge category={notice.category} />
                    <span className="truncate text-foreground">{notice.title}</span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {pageCount > 1 ? (
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={page === 0}
                onClick={() => setPage((value) => value - 1)}
                aria-label={t.site.home.notices.prevPageLabel}
              >
                <ChevronLeft />
              </Button>
              <span className="text-xs text-muted-foreground">
                {page + 1} / {pageCount}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={page === pageCount - 1}
                onClick={() => setPage((value) => value + 1)}
                aria-label={t.site.home.notices.nextPageLabel}
              >
                <ChevronRight />
              </Button>
            </div>
          ) : null}
        </SiteContainer>
      </CollapsibleContent>
    </Collapsible>
  );
}

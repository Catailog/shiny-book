import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

const MOCK_NOTICES = [
  {
    id: '1',
    category: null,
    pinned: true,
    title: '[필독] 2026 설날 연휴 배송 일정 및 오프라인 아틀리에 휴무 안내',
    date: '2026.02.12',
    views: '1,420',
  },
  {
    id: '2',
    category: null,
    pinned: true,
    title: '[안내] 이탈리아 풀그레인 린넨 레더 원단 품질 개선 및 가격 동결 공지',
    date: '2026.02.01',
    views: '890',
  },
  {
    id: '3',
    category: 'serviceUpdate',
    pinned: false,
    title: '모바일 맞춤 편집기 신규 테마 업데이트 완료 (어도비 스타일 가이드 적용)',
    date: '2026.01.28',
    views: '320',
  },
  {
    id: '4',
    category: 'event',
    pinned: false,
    title: '[봄맞이 이벤트] 3월 신학기 아기 성장 포토북 얼리버드 예약 15% 할인',
    date: '2026.01.15',
    views: '450',
  },
  {
    id: '5',
    category: 'maintenance',
    pinned: false,
    title: '서버 안정화를 위한 시스템 정기 점검 안내 (01/20 02:00 ~ 05:00)',
    date: '2026.01.10',
    views: '180',
  },
  {
    id: '6',
    category: 'serviceUpdate',
    pinned: false,
    title: '친환경 아카이빙 FSC 에코 등급 세분화 선택 옵션 개설 안내',
    date: '2026.01.03',
    views: '240',
  },
] as const;

export default async function NoticesPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-muted py-16">
        <SiteContainer className="text-center">
          <p className="text-sm font-semibold text-primary uppercase">{t.notice.list.eyebrow}</p>
          <h1 className="mt-2 font-heading text-5xl font-bold text-foreground">
            {t.notice.list.title}
          </h1>
        </SiteContainer>
      </div>

      <SiteContainer className="flex flex-col gap-6 border-b border-border py-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="default" size="sm">
              {t.notice.list.categoryTabs.all}
            </Button>
            <Button variant="outline" size="sm">
              {t.notice.list.categoryTabs.serviceUpdate}
            </Button>
            <Button variant="outline" size="sm">
              {t.notice.list.categoryTabs.event}
            </Button>
            <Button variant="outline" size="sm">
              {t.notice.list.categoryTabs.maintenance}
            </Button>
          </div>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder={t.notice.list.searchPlaceholder}
              className="w-70 pl-9"
            />
          </div>
        </div>
      </SiteContainer>

      <SiteContainer className="flex flex-col gap-6 py-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.notice.list.table.category}</TableHead>
              <TableHead>{t.notice.list.table.title}</TableHead>
              <TableHead>{t.notice.list.table.date}</TableHead>
              <TableHead className="text-right">{t.notice.list.table.views}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_NOTICES.map((notice) => (
              <TableRow key={notice.id} className={notice.pinned ? 'bg-muted' : ''}>
                <TableCell>
                  {notice.pinned ? (
                    <Badge className="bg-primary text-primary-foreground">
                      {t.notice.list.pinnedLabel}
                    </Badge>
                  ) : notice.category ? (
                    <Badge variant="secondary">{t.notice.list.categoryTabs[notice.category]}</Badge>
                  ) : null}
                </TableCell>
                <TableCell
                  className={
                    notice.pinned ? 'font-bold text-foreground' : 'font-medium text-foreground'
                  }
                >
                  {notice.title}
                </TableCell>
                <TableCell className="text-muted-foreground">{notice.date}</TableCell>
                <TableCell className="text-right text-muted-foreground">{notice.views}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" aria-label="Previous page">
            <ChevronLeft aria-hidden="true" className="size-4" />
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button key={page} variant={page === 1 ? 'primary' : 'outline'} size="icon">
              {page}
            </Button>
          ))}
          <Button variant="outline" size="icon" aria-label="Next page">
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </SiteContainer>
    </div>
  );
}

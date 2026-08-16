import Link from 'next/link';

import { Eye, Plus, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { AdminTopbar } from '../admin-topbar';

const MOCK_ANNOUNCEMENTS = [
  {
    id: '1',
    category: 'Service',
    title: '추석 연휴 배송 일정 및 고사 휴무 안내',
    author: 'Admin Sarah',
    date: '2025.09.20',
    status: 'published',
    views: 142,
  },
  {
    id: '2',
    category: 'Event',
    title: '가을 감성 가득, 하드커버 한정 10% 쿠폰 배포',
    author: 'Admin Sarah',
    date: '2025.09.15',
    status: 'draft',
    views: 0,
  },
] as const;

export default async function AdminAnnouncementsPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.announcements.title} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="default" size="sm">
              {t.admin.announcements.list.categoryTabs.all}
            </Button>
            <Button variant="outline" size="sm">
              {t.admin.announcements.list.categoryTabs.service}
            </Button>
            <Button variant="outline" size="sm">
              {t.admin.announcements.list.categoryTabs.event}
            </Button>
            <Button variant="outline" size="sm">
              {t.admin.announcements.list.categoryTabs.maintenance}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                placeholder={t.admin.announcements.list.searchPlaceholder}
                className="w-60 pl-9"
              />
            </div>
            <Button render={<Link href={ADMIN_ROUTES.ANNOUNCEMENTS_NEW} />} nativeButton={false}>
              <Plus aria-hidden="true" className="size-4" />
              {t.admin.announcements.list.createButton}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Checkbox id="select-all-announcements" />
            <label htmlFor="select-all-announcements" className="text-sm text-muted-foreground">
              {t.admin.announcements.list.selectAll} ({MOCK_ANNOUNCEMENTS.length})
            </label>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>{t.admin.announcements.list.table.category}</TableHead>
                <TableHead>{t.admin.announcements.list.table.title}</TableHead>
                <TableHead>{t.admin.announcements.list.table.author}</TableHead>
                <TableHead>{t.admin.announcements.list.table.date}</TableHead>
                <TableHead>{t.admin.announcements.list.table.status}</TableHead>
                <TableHead>{t.admin.announcements.list.table.views}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ANNOUNCEMENTS.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell>
                    <Checkbox aria-label={announcement.title} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{announcement.category}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {announcement.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{announcement.author}</TableCell>
                  <TableCell className="text-muted-foreground">{announcement.date}</TableCell>
                  <TableCell>
                    {announcement.status === 'published' ? (
                      <Badge className="bg-order-status-done/10 text-order-status-done">
                        {t.admin.announcements.list.statusLabels.published}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {t.admin.announcements.list.statusLabels.draft}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye aria-hidden="true" className="size-3.5" />
                      {announcement.views}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

import { Plus, Search } from 'lucide-react';

import { AnnouncementCategoryBadge } from '@/components/announcement-category-badge';
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
import { ADMIN_ANNOUNCEMENT_LIST_LIMIT } from '@/constants/announcement';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getAnnouncements } from '@/lib/announcements/get-announcements';
import { formatDate } from '@/lib/format-date';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from '../admin-topbar';

export default async function AdminAnnouncementsPage() {
  const t = locales[defaultLocale];
  const announcements = await getAnnouncements(ADMIN_ANNOUNCEMENT_LIST_LIMIT);

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.announcements.title} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                placeholder={t.admin.announcements.list.searchPlaceholder}
                className="w-60 bg-input-background pl-9"
              />
            </div>
            <Button
              render={<Link href={ADMIN_ROUTES.ANNOUNCEMENTS_NEW} />}
              nativeButton={false}
              variant="primary"
            >
              <Plus aria-hidden="true" className="size-4" />
              {t.admin.announcements.list.createButton}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.announcements.list.table.category}</TableHead>
                <TableHead>{t.admin.announcements.list.table.title}</TableHead>
                <TableHead>{t.admin.announcements.list.table.date}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    {t.admin.announcements.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell>
                    <AnnouncementCategoryBadge category={announcement.category} />
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    <Link
                      href={`${ADMIN_ROUTES.ANNOUNCEMENTS}/${announcement.id}/edit`}
                      className="hover:underline"
                    >
                      {announcement.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(announcement.created_at)}
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

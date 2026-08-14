import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_ANNOUNCEMENT_LIST_LIMIT } from '@/constants/announcement';
import { getAnnouncements } from '@/lib/announcements/get-announcements';
import { defaultLocale, locales } from '@/locales';

import { createAnnouncement } from './actions';
import { AnnouncementForm } from './announcement-form';

export default async function AdminAnnouncementsPage() {
  const t = locales[defaultLocale];
  const announcements = await getAnnouncements(ADMIN_ANNOUNCEMENT_LIST_LIMIT);

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.admin.announcements.title}</h1>
      <div className="max-w-md rounded-lg border border-border p-4">
        <AnnouncementForm
          action={createAnnouncement}
          submitLabel={t.admin.announcements.form.createButton}
          submittingLabel={t.admin.announcements.form.submitting}
        />
      </div>
      {announcements.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.admin.announcements.empty}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.announcements.columns.title}</TableHead>
              <TableHead>{t.admin.announcements.columns.createdAt}</TableHead>
              <TableHead>{t.admin.announcements.columns.updatedAt}</TableHead>
              <TableHead>{t.admin.announcements.columns.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell className="font-medium text-foreground">{announcement.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(announcement.created_at).toLocaleString('ko-KR')}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(announcement.updated_at).toLocaleString('ko-KR')}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/announcements/${announcement.id}/edit`}
                    className="text-sm font-medium text-foreground underline"
                  >
                    {t.admin.announcements.editLink}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_ROUTES } from '@/constants/routes';
import { formatDate } from '@/lib/format-date';
import { getInquiries } from '@/lib/inquiries/get-inquiries';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from '../admin-topbar';

export default async function AdminInquiriesPage() {
  const t = locales[defaultLocale];
  const inquiries = await getInquiries();

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.inquiries.title} subtitle={t.admin.inquiries.list.subtitle} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.inquiries.list.table.customerName}</TableHead>
                <TableHead>{t.admin.inquiries.list.table.subject}</TableHead>
                <TableHead>{t.admin.inquiries.list.table.status}</TableHead>
                <TableHead>{t.admin.inquiries.list.table.receivedDate}</TableHead>
                <TableHead className="text-right">{t.admin.inquiries.list.table.view}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t.admin.inquiries.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {inquiries.map((inquiry) => {
                const isAnswered = inquiry.answer !== null;

                return (
                  <TableRow key={inquiry.id} className={isAnswered ? '' : 'bg-primary-soft'}>
                    <TableCell>{inquiry.consumerEmail ?? '-'}</TableCell>
                    <TableCell className="font-medium text-foreground">{inquiry.title}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          isAnswered
                            ? 'bg-order-status-done/10 text-order-status-done'
                            : 'bg-destructive/10 text-destructive'
                        }
                      >
                        {isAnswered
                          ? t.admin.inquiries.statusAnswered
                          : t.admin.inquiries.statusPending}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(inquiry.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`${ADMIN_ROUTES.INQUIRIES}/${inquiry.id}`}
                        className="inline-flex text-muted-foreground hover:text-foreground"
                        aria-label={inquiry.title}
                      >
                        <ChevronRight aria-hidden="true" className="size-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

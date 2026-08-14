import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getInquiries } from '@/lib/inquiries/get-inquiries';
import { defaultLocale, locales } from '@/locales';

export default async function AdminInquiriesPage() {
  const t = locales[defaultLocale];
  const inquiries = await getInquiries();

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.admin.inquiries.title}</h1>
      {inquiries.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.admin.inquiries.empty}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.inquiries.columns.title}</TableHead>
              <TableHead>{t.admin.inquiries.columns.consumer}</TableHead>
              <TableHead>{t.admin.inquiries.columns.status}</TableHead>
              <TableHead>{t.admin.inquiries.columns.createdAt}</TableHead>
              <TableHead>{t.admin.inquiries.columns.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell className="font-medium text-foreground">{inquiry.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {inquiry.consumerEmail ?? inquiry.consumer_id}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {inquiry.answer
                      ? t.admin.inquiries.statusAnswered
                      : t.admin.inquiries.statusPending}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(inquiry.created_at).toLocaleString('ko-KR')}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/inquiries/${inquiry.id}`}
                    className="text-sm font-medium text-foreground underline"
                  >
                    {t.admin.inquiries.viewLink}
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

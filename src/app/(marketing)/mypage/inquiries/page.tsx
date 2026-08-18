import Link from 'next/link';

import { Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { INQUIRY_CATEGORY } from '@/constants/inquiry-category';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { formatDate } from '@/lib/format-date';
import { getLocale } from '@/lib/i18n/get-locale';
import { getInquiriesByConsumer } from '@/lib/inquiries/get-inquiries-by-consumer';
import { locales } from '@/locales';

export default async function MypageInquiriesPage() {
  const locale = await getLocale();
  const t = locales[locale];
  const consumer = await getCurrentConsumer();
  const inquiries = consumer ? await getInquiriesByConsumer(consumer.id) : [];

  return (
    <div className="flex flex-1 flex-col gap-6 px-10 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold text-foreground">
            {t.consumer.inquiries.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.consumer.inquiries.subtitle}</p>
        </div>
        <Button
          render={<Link href={CONSUMER_ROUTES.NEW_INQUIRY} />}
          nativeButton={false}
          variant="primary"
        >
          <Plus aria-hidden="true" className="size-4" />
          {t.consumer.inquiries.newButton}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-input-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead>{t.consumer.inquiries.table.category}</TableHead>
              <TableHead>{t.consumer.inquiries.table.title}</TableHead>
              <TableHead>{t.consumer.inquiries.table.status}</TableHead>
              <TableHead>{t.consumer.inquiries.table.createdAt}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  {t.consumer.inquiries.empty}
                </TableCell>
              </TableRow>
            ) : null}
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id} className="hover:bg-transparent">
                <TableCell>
                  <Badge className="bg-muted text-muted-foreground">
                    {inquiry.category === INQUIRY_CATEGORY.ORDER
                      ? t.consumer.inquiries.form.categoryOptions.order
                      : t.consumer.inquiries.form.categoryOptions.general}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  <Link href={`/mypage/inquiries/${inquiry.id}`} className="hover:underline">
                    {inquiry.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {inquiry.answered_at ? (
                    <Badge className="bg-order-status-done/10 text-order-status-done">
                      {t.consumer.inquiries.statusAnswered}
                    </Badge>
                  ) : (
                    <Badge className="bg-primary-soft text-primary">
                      {t.consumer.inquiries.statusPending}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(inquiry.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

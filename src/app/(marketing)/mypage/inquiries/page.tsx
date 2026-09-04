import Link from 'next/link';

import { Plus } from 'lucide-react';

import { ListPagination } from '@/components/list-pagination';
import { RelativeDate } from '@/components/relative-date';
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
import { DEFAULT_LIST_PAGE_SIZE } from '@/constants/pagination';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { formatIdPrefix } from '@/lib/format-id-prefix';
import { getLocale } from '@/lib/i18n/get-locale';
import { getInquiriesByConsumer } from '@/lib/inquiries/get-inquiries-by-consumer';
import { paginate, parsePageParam } from '@/lib/pagination';
import { locales } from '@/locales';

export default async function MypageInquiriesPage(props: PageProps<'/mypage/inquiries'>) {
  const locale = await getLocale();
  const t = locales[locale];
  const searchParams = await props.searchParams;
  const consumer = await getCurrentConsumer();
  const allInquiries = consumer ? await getInquiriesByConsumer(consumer.id) : [];
  const {
    items: inquiries,
    page,
    totalPages,
  } = paginate(allInquiries, parsePageParam(searchParams.page), DEFAULT_LIST_PAGE_SIZE);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-10 md:py-10">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        {/* table-fixed shares out the unset title column from whatever's left of
            the table's own width - on a shrinking container that heads to 0 and
            its text starts overlapping the fixed-width columns. A min-width on
            the table stops that and lets the wrapper's own overflow-x-auto (see
            Table in components/ui/table.tsx) take over as a real scrollbar. */}
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="w-28">{t.consumer.inquiries.table.inquiryId}</TableHead>
              <TableHead className="w-32">{t.consumer.inquiries.table.category}</TableHead>
              <TableHead>{t.consumer.inquiries.table.title}</TableHead>
              <TableHead className="w-40">{t.consumer.inquiries.table.orderTitle}</TableHead>
              <TableHead className="w-28">{t.consumer.inquiries.table.status}</TableHead>
              <TableHead className="w-28">{t.consumer.inquiries.table.createdAt}</TableHead>
              <TableHead className="w-28">{t.consumer.inquiries.table.lastMessageDate}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  {t.consumer.inquiries.empty}
                </TableCell>
              </TableRow>
            ) : null}
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id} className="hover:bg-transparent">
                <TableCell className="text-muted-foreground">
                  {formatIdPrefix(inquiry.id)}
                </TableCell>
                <TableCell>
                  <Badge className="bg-muted text-muted-foreground">
                    {inquiry.category === INQUIRY_CATEGORY.ORDER
                      ? t.consumer.inquiries.form.categoryOptions.order
                      : t.consumer.inquiries.form.categoryOptions.general}
                  </Badge>
                </TableCell>
                <TableCell className="truncate font-semibold text-foreground">
                  <Link href={`/mypage/inquiries/${inquiry.id}`} className="hover:underline">
                    {inquiry.title}
                  </Link>
                </TableCell>
                <TableCell className="truncate text-muted-foreground">
                  {inquiry.orderTitle ?? '-'}
                </TableCell>
                <TableCell>
                  {inquiry.answered_at && !inquiry.hasNewConsumerReply ? (
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
                  <RelativeDate value={inquiry.created_at} locale={locale} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <RelativeDate value={inquiry.lastMessageAt} locale={locale} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ListPagination
        basePath={CONSUMER_ROUTES.INQUIRIES}
        searchParams={searchParams}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}

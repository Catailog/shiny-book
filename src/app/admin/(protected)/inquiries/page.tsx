import { ClickableTableRow } from '@/components/clickable-table-row';
import { FilterLink } from '@/components/filter-link';
import { ListPagination } from '@/components/list-pagination';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { INQUIRY_CATEGORY } from '@/constants/inquiry-category';
import { ADMIN_PAGE_SIZE_OPTIONS, DEFAULT_LIST_PAGE_SIZE } from '@/constants/pagination';
import { ADMIN_ROUTES } from '@/constants/routes';
import { formatDate } from '@/lib/format-date';
import { getInquiries } from '@/lib/inquiries/get-inquiries';
import { firstSearchParam, paginate, parsePageParam, parsePageSizeParam } from '@/lib/pagination';
import { defaultLocale, locales } from '@/locales';

import { AdminPageSizeSelect } from '../admin-page-size-select';
import { AdminTopbar } from '../admin-topbar';

const FILTER_TABS = ['all', 'new', 'followup', 'unresolved', 'answered'] as const;
type InquiryFilter = (typeof FILTER_TABS)[number];

function isInquiryFilter(value: string): value is InquiryFilter {
  return (FILTER_TABS as readonly string[]).includes(value);
}

export default async function AdminInquiriesPage(props: PageProps<'/admin/inquiries'>) {
  const t = locales[defaultLocale];
  const searchParams = await props.searchParams;
  const filterParam = firstSearchParam(searchParams.filter);
  const activeFilter = isInquiryFilter(filterParam) ? filterParam : 'all';

  const allInquiries = await getInquiries();
  const filteredInquiries = allInquiries.filter((inquiry) => {
    const isNew = inquiry.answered_at === null;
    const isFollowUp = inquiry.answered_at !== null && inquiry.hasNewConsumerReply;
    const isAnswered = inquiry.answered_at !== null && !inquiry.hasNewConsumerReply;

    if (activeFilter === 'new') {
      return isNew;
    }
    if (activeFilter === 'followup') {
      return isFollowUp;
    }
    if (activeFilter === 'unresolved') {
      return isNew || isFollowUp;
    }
    if (activeFilter === 'answered') {
      return isAnswered;
    }
    return true;
  });
  const pageSize = parsePageSizeParam(
    searchParams.pageSize,
    ADMIN_PAGE_SIZE_OPTIONS,
    DEFAULT_LIST_PAGE_SIZE,
  );
  const {
    items: inquiries,
    page,
    totalPages,
  } = paginate(filteredInquiries, parsePageParam(searchParams.page), pageSize);

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.inquiries.title} actions={<AdminPageSizeSelect />} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex gap-2">
          <FilterLink href={ADMIN_ROUTES.INQUIRIES} isActive={activeFilter === 'all'}>
            {t.admin.inquiries.list.filterAllLabel}
          </FilterLink>
          <FilterLink
            href={`${ADMIN_ROUTES.INQUIRIES}?filter=new`}
            isActive={activeFilter === 'new'}
          >
            {t.admin.inquiries.statusPending}
          </FilterLink>
          <FilterLink
            href={`${ADMIN_ROUTES.INQUIRIES}?filter=followup`}
            isActive={activeFilter === 'followup'}
          >
            {t.admin.inquiries.newReplyBadge}
          </FilterLink>
          <FilterLink
            href={`${ADMIN_ROUTES.INQUIRIES}?filter=unresolved`}
            isActive={activeFilter === 'unresolved'}
          >
            {t.admin.inquiries.list.unresolvedFilterLabel}
          </FilterLink>
          <FilterLink
            href={`${ADMIN_ROUTES.INQUIRIES}?filter=answered`}
            isActive={activeFilter === 'answered'}
          >
            {t.admin.inquiries.statusAnswered}
          </FilterLink>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-input-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-40">{t.admin.inquiries.list.table.customerName}</TableHead>
                <TableHead className="w-28">{t.admin.inquiries.list.table.category}</TableHead>
                <TableHead>{t.admin.inquiries.list.table.subject}</TableHead>
                <TableHead className="w-24">{t.admin.inquiries.list.table.status}</TableHead>
                <TableHead className="w-28">{t.admin.inquiries.list.table.receivedDate}</TableHead>
                <TableHead className="w-28">
                  {t.admin.inquiries.list.table.lastMessageDate}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t.admin.inquiries.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {inquiries.map((inquiry) => {
                const isAnswered = inquiry.answered_at !== null && !inquiry.hasNewConsumerReply;

                return (
                  <ClickableTableRow
                    key={inquiry.id}
                    href={`${ADMIN_ROUTES.INQUIRIES}/${inquiry.id}`}
                  >
                    <TableCell className="truncate">
                      {inquiry.consumer_id === null
                        ? t.admin.inquiries.list.deletedConsumerLabel
                        : (inquiry.consumerEmail ?? '-')}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-muted text-muted-foreground">
                        {inquiry.category === INQUIRY_CATEGORY.ORDER
                          ? t.consumer.inquiries.form.categoryOptions.order
                          : t.consumer.inquiries.form.categoryOptions.general}
                      </Badge>
                    </TableCell>
                    <TableCell className="truncate font-medium text-foreground">
                      {inquiry.title}
                    </TableCell>
                    <TableCell>
                      {inquiry.hasNewConsumerReply ? (
                        <Badge className="bg-destructive/10 text-destructive">
                          {t.admin.inquiries.newReplyBadge}
                        </Badge>
                      ) : (
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
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(inquiry.created_at)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(inquiry.lastMessageAt)}
                    </TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <ListPagination
          basePath={ADMIN_ROUTES.INQUIRIES}
          searchParams={searchParams}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

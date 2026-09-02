import { ListPagination } from '@/components/list-pagination';
import { RelativeDate } from '@/components/relative-date';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_PAGE_SIZE_OPTIONS, DEFAULT_LIST_PAGE_SIZE } from '@/constants/pagination';
import { ADMIN_INITIATED_REFUND_REASON, REFUND_STATUS } from '@/constants/refund';
import { ADMIN_ROUTES } from '@/constants/routes';
import { formatIdPrefix } from '@/lib/format-id-prefix';
import { formatCurrency } from '@/lib/format/currency';
import { paginate, parsePageParam, parsePageSizeParam } from '@/lib/pagination';
import { getRefundRequests } from '@/lib/refunds/get-refund-requests';
import { defaultLocale, locales } from '@/locales';

import { AdminPageSizeSelect } from '../admin-page-size-select';
import { AdminTopbar } from '../admin-topbar';
import { RefundRetryButton } from './refund-retry-button';

export default async function AdminRefundsPage(props: PageProps<'/admin/refunds'>) {
  const t = locales[defaultLocale];
  const searchParams = await props.searchParams;

  const all = await getRefundRequests();
  const pageSize = parsePageSizeParam(
    searchParams.pageSize,
    ADMIN_PAGE_SIZE_OPTIONS,
    DEFAULT_LIST_PAGE_SIZE,
  );
  const { items, page, totalPages } = paginate(all, parsePageParam(searchParams.page), pageSize);

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.refunds.title} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex justify-end">
          <AdminPageSizeSelect />
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-input-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-56">{t.admin.refunds.table.order}</TableHead>
                <TableHead>{t.admin.refunds.table.note}</TableHead>
                <TableHead className="w-32">{t.admin.refunds.table.amount}</TableHead>
                <TableHead className="w-24">{t.admin.refunds.table.status}</TableHead>
                <TableHead className="w-28">{t.admin.refunds.table.processedAt}</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t.admin.refunds.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-transparent">
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="truncate font-medium text-foreground">
                        {item.orderTitle ?? formatIdPrefix(item.orderId)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatIdPrefix(item.orderId)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">
                    {item.reviewNote ??
                      (item.reason === ADMIN_INITIATED_REFUND_REASON
                        ? t.admin.refunds.adminInitiatedLabel
                        : item.reason)}
                  </TableCell>
                  <TableCell>
                    {item.requestedAmount !== null
                      ? formatCurrency(item.requestedAmount)
                      : t.admin.refunds.fullAmountLabel}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-muted text-muted-foreground">
                      {t.admin.refunds.status[item.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <RelativeDate value={item.createdAt} locale={defaultLocale} />
                  </TableCell>
                  <TableCell>
                    {item.status === REFUND_STATUS.FAILED ? (
                      <RefundRetryButton refundRequestId={item.id} />
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ListPagination
          basePath={ADMIN_ROUTES.REFUNDS}
          searchParams={searchParams}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

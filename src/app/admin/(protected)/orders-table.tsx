'use client';

import { useState } from 'react';

import { OrderStatusBadge } from '@/components/order-status-badge';
import { RelativeDate } from '@/components/relative-date';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ORDER_STATUS, type OrderStatus, isOrderStatus } from '@/constants/order-status';
import { isRefundableOrderStatus } from '@/constants/refund';
import { formatIdPrefix } from '@/lib/format-id-prefix';
import type { OrderWithConsumerName } from '@/lib/orders/get-orders';
import { getNextStatuses, getPreviousStatus } from '@/lib/orders/order-state-machine';
import { defaultLocale, locales } from '@/locales';

import { OrderActionsMenu } from './order-actions-menu';
import { ViewOrderPhotosButton } from './view-order-photos-button';

interface OrdersTableProps {
  orders: OrderWithConsumerName[];
  activeFilter: OrderStatus | null;
  showSimulator: boolean;
}

export function OrdersTable({ orders, activeFilter, showSimulator }: OrdersTableProps) {
  const t = locales[defaultLocale];
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk selection only makes sense once a single status is filtered on - every
  // visible row then shares the same (and only) next status, so one button can
  // advance them all unambiguously. `awaiting_payment` is excluded because that
  // transition is payment-driven, not admin-driven (matches the row menu).
  const bulkTargetStatus =
    activeFilter !== null && activeFilter !== ORDER_STATUS.AWAITING_PAYMENT
      ? (getNextStatuses(activeFilter)[0] ?? null)
      : null;
  const canBulkSelect = bulkTargetStatus !== null;
  const allSelected = canBulkSelect && orders.length > 0 && selectedIds.size === orders.length;

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? new Set(orders.map((order) => order.id)) : new Set());
  }

  function toggleOne(orderId: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(orderId);
      } else {
        next.delete(orderId);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {canBulkSelect && selectedIds.size > 0 ? (
        <div className="flex items-center gap-3 rounded-md bg-muted px-3 py-2 text-sm">
          <span className="font-medium text-foreground">
            {selectedIds.size}
            {t.admin.orders.bulk.selectedCountSuffix}
          </span>
        </div>
      ) : null}
      <div className="overflow-hidden rounded-lg border border-border bg-input-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              {canBulkSelect ? (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleAll(checked === true)}
                    aria-label={t.admin.orders.bulk.selectAllLabel}
                  />
                </TableHead>
              ) : null}
              <TableHead>{t.admin.orders.columns.title}</TableHead>
              <TableHead className="w-32">{t.admin.orders.columns.customerName}</TableHead>
              <TableHead className="w-20">{t.admin.orders.columns.quantity}</TableHead>
              <TableHead className="w-28">{t.admin.orders.columns.amount}</TableHead>
              <TableHead className="w-24">{t.admin.orders.columns.status}</TableHead>
              <TableHead className="w-28">{t.admin.orders.columns.files}</TableHead>
              <TableHead className="w-28">{t.admin.orders.columns.createdAt}</TableHead>
              <TableHead className="w-20">{t.admin.orders.columns.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canBulkSelect ? 9 : 8}
                  className="text-center text-muted-foreground"
                >
                  {t.admin.orders.empty}
                </TableCell>
              </TableRow>
            ) : null}
            {orders.map((order) => {
              const status = isOrderStatus(order.status) ? order.status : null;
              const nextStatus =
                status && status !== ORDER_STATUS.AWAITING_PAYMENT
                  ? getNextStatuses(status)[0]
                  : undefined;
              const previousStatus = status ? getPreviousStatus(status) : null;

              return (
                <TableRow key={order.id}>
                  {canBulkSelect ? (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(order.id)}
                        onCheckedChange={(checked) => toggleOne(order.id, checked === true)}
                        aria-label={t.admin.orders.bulk.selectRowLabel}
                      />
                    </TableCell>
                  ) : null}
                  <TableCell className="truncate font-medium text-foreground">
                    <div className="flex flex-col gap-0.5">
                      <span className="truncate">{order.title}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {formatIdPrefix(order.id)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="truncate text-muted-foreground">
                    {order.consumerName ?? '-'}
                  </TableCell>
                  <TableCell>
                    {order.quantity}
                    {t.admin.orders.quantitySuffix}
                  </TableCell>
                  <TableCell>₩{order.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {status ? <OrderStatusBadge status={status} /> : order.status}
                  </TableCell>
                  <TableCell>
                    {order.page_count !== null ? (
                      <ViewOrderPhotosButton orderId={order.id} />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <RelativeDate value={order.created_at} locale={defaultLocale} />
                  </TableCell>
                  <TableCell>
                    {status ? (
                      <OrderActionsMenu
                        orderId={order.id}
                        status={status}
                        previousStatus={previousStatus}
                        nextStatus={nextStatus ?? null}
                        orderAmount={order.amount}
                        refundedAmount={order.refunded_amount}
                        isRefundable={isRefundableOrderStatus(status)}
                        showSimulator={showSimulator}
                      />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

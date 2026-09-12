import { isOrderStatus } from '@/constants/order-status';
import { formatDateTime } from '@/lib/format-date';
import type { OrderWithConsumerName } from '@/lib/orders/get-orders';
import { defaultLocale, locales } from '@/locales';

const CSV_HEADERS = ['주문ID', '도서명', '고객명', '수량', '결제금액', '상태', '생성일시'];

// A UTF-8 BOM prefix so Excel on Windows (the admin's usual environment) picks
// up the encoding correctly instead of mangling the Korean headers/values.
const UTF8_BOM = '﻿';

type OrdersCsvRow = Pick<
  OrderWithConsumerName,
  'id' | 'title' | 'consumerName' | 'quantity' | 'amount' | 'status' | 'created_at'
>;

export function buildOrdersCsv(orders: OrdersCsvRow[]): string {
  const t = locales[defaultLocale];
  const rows = orders.map((order) => {
    const statusLabel = isOrderStatus(order.status) ? t.orderStatus[order.status] : order.status;
    return [
      order.id,
      order.title,
      order.consumerName ?? '',
      String(order.quantity),
      String(order.amount),
      statusLabel,
      formatDateTime(order.created_at),
    ];
  });

  return (
    UTF8_BOM + [CSV_HEADERS, ...rows].map((row) => row.map(escapeCsvField).join(',')).join('\r\n')
  );
}

function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

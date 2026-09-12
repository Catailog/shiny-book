import { describe, expect, it } from 'vitest';

import { ORDER_STATUS } from '@/constants/order-status';
import { formatDateTime } from '@/lib/format-date';

import { buildOrdersCsv } from './build-orders-csv';

const CREATED_AT = '2026-09-04T14:28:07.000Z';

function buildOrder(overrides: Partial<Parameters<typeof buildOrdersCsv>[0][number]> = {}) {
  return {
    id: 'order-1',
    title: '나의 첫 책',
    consumerName: '홍길동',
    quantity: 2,
    amount: 30000,
    status: ORDER_STATUS.PAID,
    created_at: CREATED_AT,
    ...overrides,
  };
}

describe('buildOrdersCsv', () => {
  it('starts with a UTF-8 BOM followed by the header row', () => {
    const csv = buildOrdersCsv([]);
    const [firstLine] = csv.split('\r\n');

    expect(csv.startsWith('﻿')).toBe(true);
    expect(firstLine?.replace('﻿', '')).toBe('주문ID,도서명,고객명,수량,결제금액,상태,생성일시');
  });

  it('produces only the header row for an empty order list', () => {
    const csv = buildOrdersCsv([]);

    expect(csv.split('\r\n')).toHaveLength(1);
  });

  it('renders a data row with the localized status label', () => {
    const csv = buildOrdersCsv([buildOrder()]);
    const [, dataLine] = csv.split('\r\n');

    expect(dataLine).toBe(
      `order-1,나의 첫 책,홍길동,2,30000,결제완료,${formatDateTime(CREATED_AT)}`,
    );
  });

  it('falls back to an empty customer name field when there is none', () => {
    const csv = buildOrdersCsv([buildOrder({ consumerName: null })]);
    const [, dataLine] = csv.split('\r\n');

    expect(dataLine).toBe(`order-1,나의 첫 책,,2,30000,결제완료,${formatDateTime(CREATED_AT)}`);
  });

  it('quotes and escapes a field containing a comma, quote, or newline', () => {
    const csv = buildOrdersCsv([buildOrder({ title: '제목, "인용" 포함\n줄바꿈' })]);
    const [, dataLine] = csv.split('\r\n');

    expect(dataLine).toBe(
      `order-1,"제목, ""인용"" 포함\n줄바꿈",홍길동,2,30000,결제완료,${formatDateTime(CREATED_AT)}`,
    );
  });
});

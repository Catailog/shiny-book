'use server';

import { ORDER_SEARCH_FIELD, isOrderSearchField } from '@/constants/order-search';
import { isOrderStatus } from '@/constants/order-status';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { buildOrdersCsv } from '@/lib/orders/build-orders-csv';
import { filterOrders } from '@/lib/orders/filter-orders';
import { getOrders } from '@/lib/orders/get-orders';

export interface ExportOrdersCsvResult {
  error: 'unauthorized' | null;
  csv?: string;
}

// Exports the same rows the admin is currently looking at (filter + search),
// not just the current page and not the row selection used for bulk actions -
// those are a separate concept and kept that way to avoid confusing the two.
export async function exportOrdersCsv(
  filterParam: string,
  searchFieldParam: string,
  query: string,
): Promise<ExportOrdersCsvResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: 'unauthorized' };
  }

  const activeFilter = isOrderStatus(filterParam) ? filterParam : null;
  const searchField = isOrderSearchField(searchFieldParam)
    ? searchFieldParam
    : ORDER_SEARCH_FIELD.TITLE;

  const allOrders = await getOrders();
  const filtered = filterOrders(allOrders, { activeFilter, searchField, query });

  return { error: null, csv: buildOrdersCsv(filtered) };
}

import { ORDER_SEARCH_FIELD, type OrderSearchField } from '@/constants/order-search';
import type { OrderStatus } from '@/constants/order-status';
import type { OrderWithConsumerName } from '@/lib/orders/get-orders';

export interface OrderListFilter {
  activeFilter: OrderStatus | null;
  searchField: OrderSearchField;
  query: string;
}

// Shared by the admin orders page and the CSV export so both apply the exact
// same status filter + search predicate to the same in-memory order list.
export function filterOrders(
  orders: OrderWithConsumerName[],
  { activeFilter, searchField, query }: OrderListFilter,
): OrderWithConsumerName[] {
  return orders.filter((order) => {
    const matchesFilter = activeFilter === null || order.status === activeFilter;
    if (!matchesFilter) {
      return false;
    }
    if (query.length === 0) {
      return true;
    }

    const normalizedQuery = query.toLowerCase();
    if (searchField === ORDER_SEARCH_FIELD.ID) {
      return order.id.toLowerCase().includes(normalizedQuery);
    }
    if (searchField === ORDER_SEARCH_FIELD.CUSTOMER_NAME) {
      return (order.consumerName ?? '').toLowerCase().includes(normalizedQuery);
    }
    return order.title.toLowerCase().includes(normalizedQuery);
  });
}

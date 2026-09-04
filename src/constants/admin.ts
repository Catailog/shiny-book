export const ADMIN_ORDER_LIST_LIMIT = 1000;

// Bulk order status transitions: server-enforced upper bound on one batch, and
// the concurrency the batch is chunked into (full parallel pressures the DB,
// fully serial is slow for a few hundred rows).
export const BULK_ACTION_MAX_ORDERS = 200;
export const BULK_ACTION_CHUNK_SIZE = 10;

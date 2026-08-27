-- Soft-delete for addresses. orders.address_id references addresses(id) with no ON
-- DELETE action, so a hard delete of an address still attached to an order fails with a
-- foreign-key violation (surfaced to the consumer as a generic error). Instead, mark the
-- address deleted and hide it from the consumer; the row stays so those orders keep a
-- valid shipping address on record.
alter table public.addresses add column deleted_at timestamptz;

create index addresses_consumer_active_idx
  on public.addresses (consumer_id)
  where deleted_at is null;

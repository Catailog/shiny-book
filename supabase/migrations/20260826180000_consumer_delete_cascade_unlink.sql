-- Allow the FK from orders/inquiries/reviews/addresses to auth.users to auto-unlink
-- (set consumer_id to null) when the consumer's auth account is deleted, so the
-- retention-required rows survive without a separate application-level update step.
alter table public.orders drop constraint orders_consumer_id_fkey;
alter table public.orders
  add constraint orders_consumer_id_fkey
  foreign key (consumer_id) references auth.users (id) on delete set null;

alter table public.inquiries drop constraint inquiries_consumer_id_fkey;
alter table public.inquiries
  add constraint inquiries_consumer_id_fkey
  foreign key (consumer_id) references auth.users (id) on delete set null;

alter table public.reviews drop constraint reviews_consumer_id_fkey;
alter table public.reviews
  add constraint reviews_consumer_id_fkey
  foreign key (consumer_id) references auth.users (id) on delete set null;

alter table public.addresses drop constraint addresses_consumer_id_fkey;
alter table public.addresses
  add constraint addresses_consumer_id_fkey
  foreign key (consumer_id) references auth.users (id) on delete set null;

-- orders_owner_check required exactly one of client_id/consumer_id to be set, which made
-- it impossible to ever null out consumer_id on a consumer order (client_id stays null),
-- so deleteConsumerAndData always failed at the orders update step. Relax it to only
-- forbid both being set at once; an order with both null means its owning consumer
-- account was later deleted.
alter table public.orders drop constraint orders_owner_check;
alter table public.orders
  add constraint orders_owner_check
  check (client_id is null or consumer_id is null);

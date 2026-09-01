-- Snapshot the shipping address onto the order so editing an address later does
-- not rewrite the destination of past orders. `address_id` stays as a record of
-- which saved address was picked. Columns are nullable: external API orders have
-- no address at all.
alter table public.orders
  add column ship_recipient_name text,
  add column ship_phone text,
  add column ship_postal_code text,
  add column ship_address_line1 text,
  add column ship_address_line2 text;

update public.orders o
set
  ship_recipient_name = a.recipient_name,
  ship_phone = a.phone,
  ship_postal_code = a.postal_code,
  ship_address_line1 = a.address_line1,
  ship_address_line2 = a.address_line2
from public.addresses a
where o.address_id = a.id;

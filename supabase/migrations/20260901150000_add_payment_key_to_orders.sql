-- Store the payment key on the order so refunds can call the payment provider's
-- cancel API. Backfill existing paid orders from the audit event that recorded
-- it at confirmation time.
alter table public.orders add column payment_key text;

update public.orders o
set payment_key = e.metadata ->> 'paymentKey'
from public.order_events e
where e.order_id = o.id
  and e.event_type = 'order.status_changed'
  and e.to_status = 'paid'
  and e.metadata ? 'paymentKey';

-- Post-payment refunds. `cancelled` remains pre-payment cancellation (no money
-- moved); `refunded` is the terminal state once an order is fully refunded.
-- Partial refunds accumulate in orders.refunded_amount and leave the status
-- untouched until the full amount is reached.

alter table public.orders add column refunded_amount int not null default 0;

alter table public.orders drop constraint orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (
    status in (
      'awaiting_payment',
      'paid',
      'printing',
      'binding',
      'shipping',
      'completed',
      'cancelled',
      'refunded'
    )
  );

-- One row per refund request. A consumer submits with a reason (and optional
-- partial amount); an admin approves or rejects; the system then processes the
-- approved request against the payment provider.
create table public.refund_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  requested_by uuid not null references auth.users (id),
  reason text not null,
  amount int,
  status text not null default 'requested',
  reviewed_by uuid references auth.users (id),
  reviewed_at timestamptz,
  review_note text,
  toss_transaction_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.refund_requests
  add constraint refund_requests_status_check
  check (status in ('requested', 'approved', 'rejected', 'completed', 'failed'));

alter table public.refund_requests
  add constraint refund_requests_amount_check check (amount is null or amount > 0);

alter table public.refund_requests enable row level security;

grant select, insert, update on public.refund_requests to service_role;

create index refund_requests_order_id_idx on public.refund_requests (order_id);
create index refund_requests_status_idx on public.refund_requests (status);

-- Add the refund lifecycle event types to the order_events audit trail.
alter table public.order_events drop constraint order_events_event_type_check;

alter table public.order_events
  add constraint order_events_event_type_check
  check (
    event_type in (
      'order.created',
      'order.status_changed',
      'webhook.received',
      'notification.sent',
      'admin.note',
      'refund.requested',
      'refund.approved',
      'refund.rejected',
      'refund.completed'
    )
  );

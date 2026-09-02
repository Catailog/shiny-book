-- The consumer refund-request / admin review-and-reject lifecycle was removed:
-- refunds are now admin-initiated and go straight to processing. Drop the states
-- and event types that lifecycle used; only `approved -> completed | failed`
-- and `refund.completed` remain.

delete from public.refund_requests where status in ('requested', 'rejected');

alter table public.refund_requests drop constraint refund_requests_status_check;

alter table public.refund_requests
  add constraint refund_requests_status_check
  check (status in ('approved', 'completed', 'failed'));

delete from public.order_events
where event_type in ('refund.requested', 'refund.approved', 'refund.rejected');

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
      'refund.completed'
    )
  );

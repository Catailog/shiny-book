'use client';

import { useEffect, useState, useTransition } from 'react';

import { toast } from 'sonner';

import { ShippingAddressSummary } from '@/components/shipping-address-summary';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ORDER_EVENT_TYPE } from '@/constants/order-event';
import { formatDateTime } from '@/lib/format-date';
import type { OrderEventView } from '@/lib/orders/order-event-timeline';
import type { OrderShippingAddressView } from '@/lib/orders/shipping-address-snapshot';
import { cn } from '@/lib/utils';
import { defaultLocale, locales } from '@/locales';

import { getOrderEventViews } from './order-events-actions';

interface OrderEventsDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderEventsDialog({ orderId, open, onOpenChange }: OrderEventsDialogProps) {
  const t = locales[defaultLocale];
  const [, startTransition] = useTransition();
  const [events, setEvents] = useState<OrderEventView[] | null>(null);
  const [shippingAddress, setShippingAddress] = useState<OrderShippingAddressView | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    // Refetch on every open - the timeline changes as the order progresses, so a
    // cached first load would go stale after a status change.
    startTransition(async () => {
      const result = await getOrderEventViews(orderId);
      if (result.errorCode) {
        toast.error(t.admin.orders.eventViewError);
        setEvents([]);
        return;
      }

      setEvents(result.events ?? []);
      setShippingAddress(result.shippingAddress ?? null);
    });
  }, [open, orderId, t]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.admin.orders.viewEventsButton}</DialogTitle>
        </DialogHeader>
        {shippingAddress ? (
          <div className="flex flex-col gap-1 rounded-md bg-muted p-3">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {t.admin.orders.shippingAddressLabel}
            </span>
            <ShippingAddressSummary
              recipientName={shippingAddress.recipientName}
              phone={shippingAddress.phone}
              postalCode={shippingAddress.postalCode}
              addressLine1={shippingAddress.addressLine1}
              addressLine2={shippingAddress.addressLine2}
            />
          </div>
        ) : null}
        {events === null ? (
          <p className="text-sm text-muted-foreground">{t.admin.orders.eventsLoading}</p>
        ) : events.length > 0 ? (
          <ol className="space-y-3">
            {events.map((event) => {
              // Shipment webhooks are sub-steps of the surrounding order status
              // milestone (e.g. "택배사 접수" under "배송중"), not milestones of
              // their own - indent and de-emphasize them so the two don't read
              // as duplicate entries.
              const isShipmentSubStep = event.eventType === ORDER_EVENT_TYPE.WEBHOOK_RECEIVED;

              return (
                <li
                  key={event.id}
                  className={cn(
                    'flex flex-col gap-0.5 border-l-2 pl-3',
                    isShipmentSubStep ? 'ml-3 border-border/50' : 'border-border',
                  )}
                >
                  <span
                    className={cn(
                      'text-sm',
                      isShipmentSubStep ? 'text-muted-foreground' : 'font-medium text-foreground',
                    )}
                  >
                    {event.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(event.at)}
                    <span className="ml-2">{event.actor}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">{t.admin.orders.eventsEmpty}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

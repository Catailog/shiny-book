'use client';

import { useState, useTransition } from 'react';

import { toast } from 'sonner';

import { ShippingAddressSummary } from '@/components/shipping-address-summary';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useT } from '@/hooks/use-t';
import { formatDateTime } from '@/lib/format-date';
import type { ConsumerOrderEventView } from '@/lib/orders/order-event-timeline';
import type { ShipmentTrackingView } from '@/lib/orders/shipment-tracking';
import type { OrderShippingAddressView } from '@/lib/orders/shipping-address-snapshot';
import { cn } from '@/lib/utils';

import { getConsumerOrderHistory } from './order-history-actions';

interface ConsumerOrderHistoryButtonProps {
  orderId: string;
}

export function ConsumerOrderHistoryButton({ orderId }: ConsumerOrderHistoryButtonProps) {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [events, setEvents] = useState<ConsumerOrderEventView[] | null>(null);
  const [shippingAddress, setShippingAddress] = useState<OrderShippingAddressView | null>(null);
  const [shipment, setShipment] = useState<ShipmentTrackingView | null>(null);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    // Refetch on every open so the progress list reflects the latest status.
    if (open) {
      startTransition(async () => {
        const result = await getConsumerOrderHistory(orderId);
        if (result.errorCode) {
          toast.error(t.consumer.mypage.orders.historyError);
          setEvents([]);
          return;
        }

        setEvents(result.events ?? []);
        setShippingAddress(result.shippingAddress ?? null);
        setShipment(result.shipment ?? null);
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<button type="button" className="text-xs text-muted-foreground underline" />}
      >
        {t.consumer.mypage.orders.historyButton}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.consumer.mypage.orders.historyTitle}</DialogTitle>
        </DialogHeader>
        {shippingAddress ? (
          <div className="flex flex-col gap-1 rounded-md bg-secondary p-3">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {t.consumer.mypage.orders.shippingAddressLabel}
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
        {shipment ? (
          <div className="flex flex-col gap-3 rounded-md bg-secondary p-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {t.consumer.mypage.orders.trackingLabel}
              </span>
              <span className="text-sm text-foreground">
                <span className="text-muted-foreground">
                  {t.consumer.mypage.orders.trackingNumberLabel}
                </span>{' '}
                {shipment.trackingNumber}
              </span>
            </div>
            <ol className="flex items-start">
              {shipment.steps.map((step, index) => (
                <li key={step.status} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full items-center">
                    <span
                      aria-hidden
                      className={cn(
                        'h-px flex-1',
                        index === 0
                          ? 'bg-transparent'
                          : step.state === 'upcoming'
                            ? 'bg-border'
                            : 'bg-primary',
                      )}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        'size-3 shrink-0 rounded-full border-2',
                        step.state === 'upcoming'
                          ? 'border-border bg-background'
                          : 'border-primary bg-primary',
                      )}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        'h-px flex-1',
                        index === shipment.steps.length - 1
                          ? 'bg-transparent'
                          : step.state === 'done'
                            ? 'bg-primary'
                            : 'bg-border',
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-xs whitespace-nowrap',
                      step.state === 'current'
                        ? 'font-semibold text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {t.shipmentStatus[step.status]}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        {events === null ? (
          <p className="text-sm text-muted-foreground">{t.consumer.mypage.orders.historyLoading}</p>
        ) : events.length > 0 ? (
          <ol className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="flex flex-col gap-0.5 border-l-2 border-border pl-3">
                <span className="text-sm font-medium text-foreground">{event.title}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(event.at)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">{t.consumer.mypage.orders.historyEmpty}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useTransition } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDateTime } from '@/lib/format-date';
import type { OrderEventView } from '@/lib/orders/order-event-timeline';
import { defaultLocale, locales } from '@/locales';

import { getOrderEventViews } from './order-events-actions';

interface ViewOrderEventsButtonProps {
  orderId: string;
}

export function ViewOrderEventsButton({ orderId }: ViewOrderEventsButtonProps) {
  const t = locales[defaultLocale];
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [events, setEvents] = useState<OrderEventView[] | null>(null);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    // Refetch on every open - the timeline changes as the order progresses, so a
    // cached first load would go stale after a status change.
    if (open) {
      startTransition(async () => {
        const result = await getOrderEventViews(orderId);
        if (result.errorCode) {
          toast.error(t.admin.orders.eventViewError);
          setEvents([]);
          return;
        }

        setEvents(result.events ?? []);
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button type="button" variant="outline" size="sm" onClick={() => handleOpenChange(true)}>
        {t.admin.orders.viewEventsButton}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.admin.orders.viewEventsButton}</DialogTitle>
        </DialogHeader>
        {events === null ? (
          <p className="text-sm text-muted-foreground">{t.admin.orders.eventsLoading}</p>
        ) : events.length > 0 ? (
          <ol className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="flex flex-col gap-0.5 border-l-2 border-border pl-3">
                <span className="text-sm font-medium text-foreground">{event.title}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(event.at)}
                  <span className="ml-2">{event.actor}</span>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">{t.admin.orders.eventsEmpty}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useTransition } from 'react';

import { toast } from 'sonner';

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

import { getConsumerOrderHistory } from './order-history-actions';

interface ConsumerOrderHistoryButtonProps {
  orderId: string;
}

export function ConsumerOrderHistoryButton({ orderId }: ConsumerOrderHistoryButtonProps) {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [events, setEvents] = useState<ConsumerOrderEventView[] | null>(null);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (open && events === null) {
      startTransition(async () => {
        const result = await getConsumerOrderHistory(orderId);
        if (result.errorCode) {
          toast.error(t.consumer.mypage.orders.historyError);
          setEvents([]);
          return;
        }

        setEvents(result.events ?? []);
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
        {isPending ? (
          <p className="text-sm text-muted-foreground">{t.consumer.mypage.orders.historyLoading}</p>
        ) : events && events.length > 0 ? (
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

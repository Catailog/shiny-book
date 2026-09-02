'use client';

import { useState, useTransition } from 'react';

import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ORDER_STATUS, type OrderStatus } from '@/constants/order-status';
import { defaultLocale, locales } from '@/locales';

import { OrderEventsDialog } from './order-events-dialog';
import { advanceOrderStatus, revertOrderStatusAction } from './order-status-actions';
import { RefundDialog } from './refund-dialog';
import { advanceCourierSimulation } from './simulate-courier-actions';

type ActivePanel = 'events' | 'refund' | 'revert' | null;

interface OrderActionsMenuProps {
  orderId: string;
  status: OrderStatus;
  previousStatus: OrderStatus | null;
  nextStatus: OrderStatus | null;
  orderAmount: number;
  refundedAmount: number;
  isRefundable: boolean;
  showSimulator: boolean;
}

export function OrderActionsMenu({
  orderId,
  status,
  previousStatus,
  nextStatus,
  orderAmount,
  refundedAmount,
  isRefundable,
  showSimulator,
}: OrderActionsMenuProps) {
  const t = locales[defaultLocale];
  const [panel, setPanel] = useState<ActivePanel>(null);
  const [isPending, startTransition] = useTransition();

  const canAdvance = nextStatus !== null && status !== ORDER_STATUS.AWAITING_PAYMENT;
  const canRevert = previousStatus !== null;
  const canSimulate = status === ORDER_STATUS.BINDING || status === ORDER_STATUS.SHIPPING;

  function handleAdvance() {
    if (!canAdvance || !nextStatus) {
      return;
    }
    startTransition(async () => {
      const result = await advanceOrderStatus(orderId, status, nextStatus);
      if (result.error) {
        toast.error(t.admin.orders.statusChangeErrors[result.error]);
      }
    });
  }

  function handleRevert() {
    if (!previousStatus) {
      return;
    }
    setPanel(null);
    startTransition(async () => {
      const result = await revertOrderStatusAction(orderId, status, previousStatus);
      if (result.error) {
        toast.error(t.admin.orders.statusChangeErrors[result.error]);
      }
    });
  }

  function handleSimulate() {
    startTransition(async () => {
      const result = await advanceCourierSimulation(orderId);
      if (result.errorCode) {
        toast.error(t.admin.orders.simulateShipment.errors[result.errorCode]);
        return;
      }
      if (result.status) {
        toast.success(
          `${t.admin.orders.simulateShipment.success} ${t.shipmentStatus[result.status]}`,
        );
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              aria-label={t.admin.orders.actionsMenuLabel}
            />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem onClick={() => setPanel('events')}>
            {t.admin.orders.viewEventsButton}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canRevert} onClick={() => setPanel('revert')}>
            {t.admin.orders.revertButton}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canAdvance} onClick={handleAdvance}>
            {t.admin.orders.advanceButton}
          </DropdownMenuItem>
          {isRefundable ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setPanel('refund')}>
                {t.admin.orders.refund.button}
              </DropdownMenuItem>
            </>
          ) : null}
          {showSimulator ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={!canSimulate} onClick={handleSimulate}>
                {t.admin.orders.simulateShipment.button}
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <OrderEventsDialog
        orderId={orderId}
        open={panel === 'events'}
        onOpenChange={(open) => setPanel(open ? 'events' : null)}
      />

      {isRefundable ? (
        <RefundDialog
          orderId={orderId}
          orderAmount={orderAmount}
          refundedAmount={refundedAmount}
          open={panel === 'refund'}
          onOpenChange={(open) => setPanel(open ? 'refund' : null)}
        />
      ) : null}

      <AlertDialog
        open={panel === 'revert'}
        onOpenChange={(open) => setPanel(open ? 'revert' : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.admin.orders.revertConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.admin.orders.revertConfirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.admin.orders.revertCancelButton}</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={handleRevert}>
              {t.admin.orders.revertConfirmButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

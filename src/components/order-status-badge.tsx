import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/constants/order-status';
import { ORDER_STATUS_TONE } from '@/constants/order-status-tone';
import { cn } from '@/lib/utils';
import { defaultLocale, locales } from '@/locales';

const TONE_CLASSES = {
  pending: 'bg-order-status-pending/10 text-order-status-pending',
  in_progress: 'bg-order-status-in-progress/10 text-order-status-in-progress',
  done: 'bg-order-status-done/10 text-order-status-done',
} as const;

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const t = locales[defaultLocale];
  const tone = ORDER_STATUS_TONE[status];

  return (
    <Badge variant="outline" className={cn('border-transparent', TONE_CLASSES[tone])}>
      {t.orderStatus[status]}
    </Badge>
  );
}

import { cn } from '@/lib/utils';

interface ShippingAddressSummaryProps {
  recipientName: string | null;
  phone: string | null;
  postalCode: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  className?: string;
}

// Renders an order's snapshotted shipping address. Shown to the order's own
// consumer and to admins, so it is not masked.
export function ShippingAddressSummary({
  recipientName,
  phone,
  postalCode,
  addressLine1,
  addressLine2,
  className,
}: ShippingAddressSummaryProps) {
  if (!recipientName && !addressLine1) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-0.5 text-sm', className)}>
      {recipientName ? (
        <span className="text-foreground">
          {recipientName}
          {phone ? <span className="ml-2 text-muted-foreground">{phone}</span> : null}
        </span>
      ) : null}
      {addressLine1 ? (
        <span className="text-muted-foreground">
          {postalCode ? `[${postalCode}] ` : ''}
          {addressLine1}
          {addressLine2 ? ` ${addressLine2}` : ''}
        </span>
      ) : null}
    </div>
  );
}

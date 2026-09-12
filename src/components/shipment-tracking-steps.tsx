import type { ShipmentJobStatus } from '@/constants/shipment-job-status';
import type { ShipmentTrackingStep } from '@/lib/orders/shipment-tracking';
import { cn } from '@/lib/utils';

interface ShipmentTrackingStepsProps {
  steps: ShipmentTrackingStep[];
  labels: Record<ShipmentJobStatus, string>;
}

export function ShipmentTrackingSteps({ steps, labels }: ShipmentTrackingStepsProps) {
  return (
    <ol className="flex items-start">
      {steps.map((step, index) => (
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
                index === steps.length - 1
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
              step.state === 'current' ? 'font-semibold text-foreground' : 'text-muted-foreground',
            )}
          >
            {labels[step.status]}
          </span>
        </li>
      ))}
    </ol>
  );
}

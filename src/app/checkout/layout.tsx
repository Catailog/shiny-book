import { TooltipProvider } from '@/components/ui/tooltip';

import { CheckoutHeader } from './checkout-header';

export default function CheckoutLayout({ children }: LayoutProps<'/checkout'>) {
  return (
    <TooltipProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <CheckoutHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </TooltipProvider>
  );
}

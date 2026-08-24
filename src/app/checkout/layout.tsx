import { SimpleHeader } from '@/components/simple-header';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function CheckoutLayout({ children }: LayoutProps<'/checkout'>) {
  return (
    <TooltipProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <SimpleHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </TooltipProvider>
  );
}

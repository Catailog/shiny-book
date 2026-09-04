import { Skeleton } from '@/components/ui/skeleton';

export default function OrderDetailLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-56" />
      </div>
      {['summary', 'payment', 'timeline'].map((key) => (
        <Skeleton key={key} className="h-32 w-full" />
      ))}
    </div>
  );
}

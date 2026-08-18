import { Skeleton } from '@/components/ui/skeleton';

interface AdminListSkeletonProps {
  columns?: number;
  rows?: number;
  showFilters?: boolean;
  showKpis?: boolean;
}

export function AdminListSkeleton({
  columns = 5,
  rows = 8,
  showFilters = true,
  showKpis = false,
}: AdminListSkeletonProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border bg-card px-10 py-6">
        <Skeleton className="h-8 w-40" />
        <div className="flex items-center gap-4">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        {showKpis ? (
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-lg" />
            ))}
          </div>
        ) : null}
        {showFilters ? (
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-24" />
            ))}
          </div>
        ) : null}
        <div className="overflow-hidden rounded-lg border border-border bg-input-background">
          <div className="flex items-center gap-4 border-b border-border bg-muted px-4 py-3">
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={index} className="h-4 flex-1" />
            ))}
          </div>
          <div className="flex flex-col">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-0"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-4 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

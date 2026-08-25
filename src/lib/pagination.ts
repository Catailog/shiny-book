export interface PaginationResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export function firstSearchParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export function parsePageParam(value: string | string[] | undefined): number {
  const parsed = Number(firstSearchParam(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function parsePageSizeParam(
  value: string | string[] | undefined,
  allowedSizes: readonly number[],
  defaultSize: number,
): number {
  const parsed = Number(firstSearchParam(value));
  return allowedSizes.includes(parsed) ? parsed : defaultSize;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems,
  };
}

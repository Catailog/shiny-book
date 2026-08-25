import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ListPaginationProps {
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
  page: number;
  totalPages: number;
}

const SIBLING_COUNT = 1;

export function ListPagination({ basePath, searchParams, page, totalPages }: ListPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getVisiblePageNumbers(page, totalPages);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildPageHref(basePath, searchParams, Math.max(1, page - 1))}
            aria-disabled={isFirstPage}
            className={isFirstPage ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
        {pageNumbers.map((pageNumber, index) =>
          pageNumber === null ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={buildPageHref(basePath, searchParams, pageNumber)}
                isActive={pageNumber === page}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={buildPageHref(basePath, searchParams, Math.min(totalPages, page + 1))}
            aria-disabled={isLastPage}
            className={isLastPage ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function buildPageHref(
  basePath: string,
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'page') {
      continue;
    }
    if (Array.isArray(value)) {
      for (const entry of value) {
        params.append(key, entry);
      }
    } else if (value !== undefined) {
      params.set(key, value);
    }
  }
  if (page > 1) {
    params.set('page', String(page));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function getVisiblePageNumbers(page: number, totalPages: number): Array<number | null> {
  const pages = new Set<number>([1, totalPages, page]);
  for (let offset = 1; offset <= SIBLING_COUNT; offset += 1) {
    if (page - offset >= 1) {
      pages.add(page - offset);
    }
    if (page + offset <= totalPages) {
      pages.add(page + offset);
    }
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: Array<number | null> = [];
  let previous: number | null = null;
  for (const pageNumber of sorted) {
    if (previous !== null && pageNumber - previous > 1) {
      result.push(null);
    }
    result.push(pageNumber);
    previous = pageNumber;
  }

  return result;
}

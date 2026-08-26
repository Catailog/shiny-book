'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ADMIN_PAGE_SIZE_OPTIONS, DEFAULT_LIST_PAGE_SIZE } from '@/constants/pagination';
import { defaultLocale, locales } from '@/locales';

export function AdminPageSizeSelect() {
  const t = locales[defaultLocale];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPageSize = searchParams.get('pageSize') ?? String(DEFAULT_LIST_PAGE_SIZE);

  function handleChange(value: string | null) {
    if (!value) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', value);
    params.delete('page');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <Select size="sm" value={currentPageSize} onValueChange={handleChange}>
      <SelectTrigger className="w-28" aria-label={t.admin.pagination.pageSizeLabel}>
        <SelectValue>
          {(value: string) => t.admin.pagination.pageSizeOption.replace('{count}', value)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {ADMIN_PAGE_SIZE_OPTIONS.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {t.admin.pagination.pageSizeOption.replace('{count}', String(size))}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

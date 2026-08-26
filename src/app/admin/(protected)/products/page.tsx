import Image from 'next/image';
import Link from 'next/link';

import { Plus } from 'lucide-react';

import { ClickableTableRow } from '@/components/clickable-table-row';
import { FilterLink } from '@/components/filter-link';
import { ListPagination } from '@/components/list-pagination';
import { RelativeDate } from '@/components/relative-date';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_PAGE_SIZE_OPTIONS, DEFAULT_LIST_PAGE_SIZE } from '@/constants/pagination';
import { isProductCategory } from '@/constants/product-category';
import { ADMIN_ROUTES } from '@/constants/routes';
import { firstSearchParam, paginate, parsePageParam, parsePageSizeParam } from '@/lib/pagination';
import { getAllProducts } from '@/lib/products/get-all-products';
import { defaultLocale, locales } from '@/locales';

import { AdminPageSizeSelect } from '../admin-page-size-select';
import { AdminTopbar } from '../admin-topbar';
import { ToggleProductActiveButton } from './toggle-product-active-button';

const FILTER_TABS = ['all', 'active', 'inactive'] as const;
type ProductFilter = (typeof FILTER_TABS)[number];

function isProductFilter(value: string): value is ProductFilter {
  return (FILTER_TABS as readonly string[]).includes(value);
}

export default async function AdminProductsPage(props: PageProps<'/admin/products'>) {
  const t = locales[defaultLocale];
  const searchParams = await props.searchParams;
  const filterParam = firstSearchParam(searchParams.filter);
  const activeFilter = isProductFilter(filterParam) ? filterParam : 'all';

  const allProducts = await getAllProducts();
  const filteredProducts = allProducts.filter((product) => {
    if (activeFilter === 'active') {
      return product.is_active;
    }
    if (activeFilter === 'inactive') {
      return !product.is_active;
    }
    return true;
  });
  const pageSize = parsePageSizeParam(
    searchParams.pageSize,
    ADMIN_PAGE_SIZE_OPTIONS,
    DEFAULT_LIST_PAGE_SIZE,
  );
  const {
    items: products,
    page,
    totalPages,
  } = paginate(filteredProducts, parsePageParam(searchParams.page), pageSize);

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.products.title} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex justify-end">
          <AdminPageSizeSelect />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <FilterLink href={ADMIN_ROUTES.PRODUCTS} isActive={activeFilter === 'all'}>
              {t.admin.products.filterTabs.all}
            </FilterLink>
            <FilterLink
              href={`${ADMIN_ROUTES.PRODUCTS}?filter=active`}
              isActive={activeFilter === 'active'}
            >
              {t.admin.products.filterTabs.active}
            </FilterLink>
            <FilterLink
              href={`${ADMIN_ROUTES.PRODUCTS}?filter=inactive`}
              isActive={activeFilter === 'inactive'}
            >
              {t.admin.products.filterTabs.inactive}
            </FilterLink>
          </div>
          <Button
            render={<Link href={ADMIN_ROUTES.PRODUCTS_NEW} />}
            nativeButton={false}
            variant="primary"
          >
            <Plus aria-hidden="true" className="size-4" />
            {t.admin.products.writeButton}
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-input-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>{t.admin.products.columns.name}</TableHead>
                <TableHead className="w-32">{t.admin.products.columns.category}</TableHead>
                <TableHead className="w-28">{t.admin.products.columns.price}</TableHead>
                <TableHead className="w-24">{t.admin.products.columns.status}</TableHead>
                <TableHead className="w-28">{t.admin.products.columns.createdAt}</TableHead>
                <TableHead className="w-32 text-right">
                  {t.admin.products.columns.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t.admin.products.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {products.map((product) => {
                const category = isProductCategory(product.category) ? product.category : null;

                return (
                  <ClickableTableRow
                    key={product.id}
                    href={`${ADMIN_ROUTES.PRODUCTS}/${product.id}/edit`}
                  >
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <span className="relative size-10 shrink-0 overflow-hidden rounded bg-muted">
                          <Image src={product.image_url} alt="" fill className="object-cover" />
                        </span>
                        <span className="truncate">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category ? t.admin.products.categoryOptions[category] : product.category}
                    </TableCell>
                    <TableCell>₩{product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.is_active
                            ? 'bg-order-status-done/10 text-order-status-done'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {product.is_active
                          ? t.admin.products.statusLabels.active
                          : t.admin.products.statusLabels.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <RelativeDate value={product.created_at} locale={defaultLocale} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <ToggleProductActiveButton
                          productId={product.id}
                          isActive={product.is_active}
                        />
                      </div>
                    </TableCell>
                  </ClickableTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <ListPagination
          basePath={ADMIN_ROUTES.PRODUCTS}
          searchParams={searchParams}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

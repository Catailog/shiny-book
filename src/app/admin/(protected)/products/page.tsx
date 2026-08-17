import Image from 'next/image';
import Link from 'next/link';

import { Plus } from 'lucide-react';

import { ClickableTableRow } from '@/components/clickable-table-row';
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
import { isProductCategory } from '@/constants/product-category';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getAllProducts } from '@/lib/products/get-all-products';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from '../admin-topbar';
import { ToggleProductActiveButton } from './toggle-product-active-button';

export default async function AdminProductsPage() {
  const t = locales[defaultLocale];
  const products = await getAllProducts();

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.products.title} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex items-center justify-end">
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
                <TableHead>{t.admin.products.columns.category}</TableHead>
                <TableHead>{t.admin.products.columns.price}</TableHead>
                <TableHead>{t.admin.products.columns.status}</TableHead>
                <TableHead className="text-right">{t.admin.products.columns.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
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
                        {product.name}
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
      </div>
    </div>
  );
}

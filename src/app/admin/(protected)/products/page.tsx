import Image from 'next/image';
import Link from 'next/link';

import { Plus } from 'lucide-react';

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

export default async function AdminProductsPage() {
  const t = locales[defaultLocale];
  const products = await getAllProducts();

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar
        title={t.admin.products.title}
        actions={
          <Button
            render={<Link href={ADMIN_ROUTES.PRODUCTS_NEW} />}
            nativeButton={false}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus aria-hidden="true" className="size-4" />
            {t.admin.products.writeButton}
          </Button>
        }
      />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.products.columns.name}</TableHead>
                <TableHead>{t.admin.products.columns.category}</TableHead>
                <TableHead>{t.admin.products.columns.price}</TableHead>
                <TableHead>{t.admin.products.columns.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    {t.admin.products.empty}
                  </TableCell>
                </TableRow>
              ) : null}
              {products.map((product) => {
                const category = isProductCategory(product.category) ? product.category : null;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-foreground">
                      <Link
                        href={`${ADMIN_ROUTES.PRODUCTS}/${product.id}/edit`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <span className="relative size-10 shrink-0 overflow-hidden rounded bg-muted">
                          <Image src={product.image_url} alt="" fill className="object-cover" />
                        </span>
                        {product.name}
                      </Link>
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

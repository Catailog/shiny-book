'use client';

import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';

import { createProduct } from '../actions';
import { ProductForm } from '../product-form';

export function CreateProductForm() {
  const t = useT();
  const router = useRouter();

  return (
    <ProductForm
      action={createProduct}
      submitLabel={t.admin.products.form.createButton}
      submittingLabel={t.admin.products.form.submitting}
      onSuccess={() => router.push(ADMIN_ROUTES.PRODUCTS)}
    />
  );
}

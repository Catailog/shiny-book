'use client';

import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

import { updateProduct } from '../../actions';
import { ProductForm } from '../../product-form';
import type { ProductFormInput } from '../../product-schema';

interface EditProductFormProps {
  id: string;
  defaultValues: ProductFormInput;
}

export function EditProductForm({ id, defaultValues }: EditProductFormProps) {
  const t = locales[defaultLocale];
  const router = useRouter();

  return (
    <ProductForm
      defaultValues={defaultValues}
      action={(values) => updateProduct(id, values)}
      submitLabel={t.admin.products.form.saveButton}
      submittingLabel={t.admin.products.form.submitting}
      onSuccess={() => router.push(ADMIN_ROUTES.PRODUCTS)}
    />
  );
}

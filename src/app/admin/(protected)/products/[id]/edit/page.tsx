import { notFound } from 'next/navigation';

import { PRODUCT_CATEGORY, isProductCategory } from '@/constants/product-category';
import { getProductById } from '@/lib/products/get-product-by-id';
import { defaultLocale, locales } from '@/locales';

import { EditProductForm } from './edit-form';

export default async function EditProductPage(props: PageProps<'/admin/products/[id]/edit'>) {
  const { id } = await props.params;
  const product = await getProductById(id);
  const t = locales[defaultLocale];

  if (!product) {
    notFound();
  }

  const category = isProductCategory(product.category)
    ? product.category
    : PRODUCT_CATEGORY.CLASSIC;

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.admin.products.editTitle}</h1>
      <div className="max-w-2xl rounded-lg border border-border bg-card p-4 shadow-sm">
        <EditProductForm
          id={product.id}
          defaultValues={{
            slug: product.slug,
            name: product.name,
            nameEn: product.name_en ?? undefined,
            size: product.size,
            description: product.description,
            price: product.price,
            imageUrl: product.image_url,
            category,
            isActive: product.is_active,
          }}
        />
      </div>
    </div>
  );
}

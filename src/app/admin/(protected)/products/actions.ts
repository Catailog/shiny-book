'use server';

import { revalidatePath } from 'next/cache';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

import { type ProductFormInput, productFormSchema } from './product-schema';

const UNIQUE_VIOLATION_CODE = '23505';

export interface ProductActionResult {
  errorCode: 'unauthorized' | 'validation_failed' | 'slug_taken' | 'unexpected_error';
}

export async function createProduct(
  input: ProductFormInput,
): Promise<ProductActionResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('products').insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    size: parsed.data.size,
    description: parsed.data.description,
    price: parsed.data.price,
    image_url: parsed.data.imageUrl,
    category: parsed.data.category,
    is_active: parsed.data.isActive,
  });

  if (error) {
    return { errorCode: error.code === UNIQUE_VIOLATION_CODE ? 'slug_taken' : 'unexpected_error' };
  }

  revalidatePath(ADMIN_ROUTES.PRODUCTS);
  return undefined;
}

export async function updateProduct(
  id: string,
  input: ProductFormInput,
): Promise<ProductActionResult | undefined> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('products')
    .update({
      slug: parsed.data.slug,
      name: parsed.data.name,
      size: parsed.data.size,
      description: parsed.data.description,
      price: parsed.data.price,
      image_url: parsed.data.imageUrl,
      category: parsed.data.category,
      is_active: parsed.data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { errorCode: error.code === UNIQUE_VIOLATION_CODE ? 'slug_taken' : 'unexpected_error' };
  }

  revalidatePath(ADMIN_ROUTES.PRODUCTS);
  return undefined;
}

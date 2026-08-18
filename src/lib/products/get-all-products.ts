import 'server-only';

import { ADMIN_PRODUCT_LIST_LIMIT } from '@/constants/product-category';
import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getAllProducts(): Promise<Tables<'products'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('products')
    .select()
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(ADMIN_PRODUCT_LIST_LIMIT);

  return data ?? [];
}

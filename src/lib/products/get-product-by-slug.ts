import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getProductBySlug(slug: string): Promise<Tables<'products'> | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('products')
    .select()
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  return data;
}

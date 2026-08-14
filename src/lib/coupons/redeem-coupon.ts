import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export type RedeemCouponResult =
  | { outcome: 'redeemed'; coupon: Tables<'coupons'>; discountedAmount: number }
  | { outcome: 'not_found' }
  | { outcome: 'inactive' }
  | { outcome: 'expired' }
  | { outcome: 'usage_limit_reached' }
  | { outcome: 'conflict' };

export function calculateDiscountedAmount(
  amount: number,
  coupon: Pick<Tables<'coupons'>, 'discount_type' | 'discount_value'>,
): number {
  const discount =
    coupon.discount_type === 'percentage'
      ? Math.floor((amount * coupon.discount_value) / 100)
      : coupon.discount_value;

  return Math.max(amount - discount, 1);
}

export async function redeemCoupon(code: string, amount: number): Promise<RedeemCouponResult> {
  const supabase = createServiceRoleClient();

  const { data: coupon } = await supabase.from('coupons').select().eq('code', code).maybeSingle();
  if (!coupon) {
    return { outcome: 'not_found' };
  }

  if (!coupon.is_active) {
    return { outcome: 'inactive' };
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { outcome: 'expired' };
  }

  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { outcome: 'usage_limit_reached' };
  }

  const { data: updated } = await supabase
    .from('coupons')
    .update({ used_count: coupon.used_count + 1 })
    .eq('id', coupon.id)
    .eq('used_count', coupon.used_count)
    .select()
    .maybeSingle();

  if (!updated) {
    return { outcome: 'conflict' };
  }

  return {
    outcome: 'redeemed',
    coupon: updated,
    discountedAmount: calculateDiscountedAmount(amount, updated),
  };
}

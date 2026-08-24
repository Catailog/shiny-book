import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export type CouponValidationResult =
  | { outcome: 'valid'; coupon: Tables<'coupons'>; discountedAmount: number }
  | { outcome: 'not_found' }
  | { outcome: 'inactive' }
  | { outcome: 'not_started' }
  | { outcome: 'expired' }
  | { outcome: 'usage_limit_reached' };

export type RedeemCouponResult =
  | { outcome: 'redeemed'; coupon: Tables<'coupons'>; discountedAmount: number }
  | { outcome: 'not_found' }
  | { outcome: 'inactive' }
  | { outcome: 'not_started' }
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

// Read-only eligibility check - used to preview a discount while an order is still
// being drafted (create/edit), without consuming the coupon's usage slot. Actually
// spending a usage slot happens only in redeemCoupon, right before payment is
// confirmed, so a coupon applied to an order that never gets paid never occupies it.
export async function validateCoupon(
  code: string,
  amount: number,
): Promise<CouponValidationResult> {
  const supabase = createServiceRoleClient();

  const { data: coupon } = await supabase.from('coupons').select().eq('code', code).maybeSingle();
  if (!coupon) {
    return { outcome: 'not_found' };
  }

  if (!coupon.is_active) {
    return { outcome: 'inactive' };
  }

  if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
    return { outcome: 'not_started' };
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { outcome: 'expired' };
  }

  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { outcome: 'usage_limit_reached' };
  }

  return { outcome: 'valid', coupon, discountedAmount: calculateDiscountedAmount(amount, coupon) };
}

export async function redeemCoupon(code: string, amount: number): Promise<RedeemCouponResult> {
  const validation = await validateCoupon(code, amount);
  if (validation.outcome !== 'valid') {
    return validation;
  }

  const supabase = createServiceRoleClient();
  const { data: updated } = await supabase
    .from('coupons')
    .update({ used_count: validation.coupon.used_count + 1 })
    .eq('id', validation.coupon.id)
    .eq('used_count', validation.coupon.used_count)
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

// Undoes a specific redeemCoupon() call - used when the payment it was reserved for
// ends up failing, so the usage slot doesn't stay consumed for a purchase that never
// happened. Targets the exact used_count the redemption left behind (couponAfterRedeem
// is redemption.coupon.used_count from that call), so it can't accidentally undo a
// different redemption that happened in between.
export async function releaseCoupon(couponId: string, usedCountAfterRedeem: number): Promise<void> {
  const supabase = createServiceRoleClient();
  await supabase
    .from('coupons')
    .update({ used_count: usedCountAfterRedeem - 1 })
    .eq('id', couponId)
    .eq('used_count', usedCountAfterRedeem);
}

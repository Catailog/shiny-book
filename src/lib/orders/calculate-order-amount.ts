import { PRICING } from '@/constants/pricing';
import type { Tables } from '@/lib/db/database.types';
import { calculateShippingFee } from '@/lib/orders/calculate-shipping-fee';

export interface OrderAmountBreakdown {
  merchandiseAmount: number;
  shippingFee: number;
  amount: number;
}

export function calculateOrderAmount(params: {
  product: Pick<Tables<'products'>, 'price'>;
  address: Pick<Tables<'addresses'>, 'postal_code'>;
  pageCount: number;
  quantity: number;
  discountedMerchandiseAmount?: number;
}): OrderAmountBreakdown {
  const merchandiseAmount =
    (params.product.price + params.pageCount * PRICING.PRICE_PER_PAGE_KRW) * params.quantity;
  const shippingFee = calculateShippingFee(params.address.postal_code, merchandiseAmount);
  const amount = (params.discountedMerchandiseAmount ?? merchandiseAmount) + shippingFee;

  return { merchandiseAmount, shippingFee, amount };
}

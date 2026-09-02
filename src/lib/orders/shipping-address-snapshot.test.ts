import { describe, expect, it } from 'vitest';

import { toShippingAddressSnapshot } from '@/lib/orders/shipping-address-snapshot';

describe('toShippingAddressSnapshot', () => {
  it('copies the shipping-relevant address fields onto ship_ columns', () => {
    expect(
      toShippingAddressSnapshot({
        recipient_name: '홍길동',
        phone: '01012345678',
        postal_code: '04524',
        address_line1: '서울특별시 중구 세종대로 110',
        address_line2: '서울특별시청',
      }),
    ).toEqual({
      ship_recipient_name: '홍길동',
      ship_phone: '01012345678',
      ship_postal_code: '04524',
      ship_address_line1: '서울특별시 중구 세종대로 110',
      ship_address_line2: '서울특별시청',
    });
  });

  it('keeps a null address_line2', () => {
    const snapshot = toShippingAddressSnapshot({
      recipient_name: '홍길동',
      phone: '01012345678',
      postal_code: '04524',
      address_line1: '서울특별시 중구 세종대로 110',
      address_line2: null,
    });

    expect(snapshot.ship_address_line2).toBeNull();
  });
});

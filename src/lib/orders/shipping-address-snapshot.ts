import type { Tables } from '@/lib/db/database.types';

export interface ShippingAddressSnapshot {
  ship_recipient_name: string;
  ship_phone: string;
  ship_postal_code: string;
  ship_address_line1: string;
  ship_address_line2: string | null;
}

type SnapshotSource = Pick<
  Tables<'addresses'>,
  'recipient_name' | 'phone' | 'postal_code' | 'address_line1' | 'address_line2'
>;

// Copy the address fields an order needs to ship onto the order row, so a later
// edit of the saved address does not change where past orders were sent.
export function toShippingAddressSnapshot(address: SnapshotSource): ShippingAddressSnapshot {
  return {
    ship_recipient_name: address.recipient_name,
    ship_phone: address.phone,
    ship_postal_code: address.postal_code,
    ship_address_line1: address.address_line1,
    ship_address_line2: address.address_line2,
  };
}

export interface OrderShippingAddressView {
  recipientName: string | null;
  phone: string | null;
  postalCode: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
}

type SnapshotColumns = Pick<
  Tables<'orders'>,
  | 'ship_recipient_name'
  | 'ship_phone'
  | 'ship_postal_code'
  | 'ship_address_line1'
  | 'ship_address_line2'
>;

// Read an order's stored shipping snapshot back out as a camelCase view for the
// UI. Returns null when the order has no snapshot (external API orders).
export function toOrderShippingAddressView(
  order: SnapshotColumns,
): OrderShippingAddressView | null {
  if (order.ship_address_line1 === null && order.ship_recipient_name === null) {
    return null;
  }

  return {
    recipientName: order.ship_recipient_name,
    phone: order.ship_phone,
    postalCode: order.ship_postal_code,
    addressLine1: order.ship_address_line1,
    addressLine2: order.ship_address_line2,
  };
}

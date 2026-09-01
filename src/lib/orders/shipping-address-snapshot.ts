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

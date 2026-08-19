export const VENDOR_TYPES = {
  PRINT_SHOP: 'print-shop',
  COURIER: 'courier',
} as const;

export type VendorType = (typeof VENDOR_TYPES)[keyof typeof VENDOR_TYPES];

const VENDOR_TYPE_VALUES: readonly VendorType[] = Object.values(VENDOR_TYPES);

export function isVendorType(value: string): value is VendorType {
  return VENDOR_TYPE_VALUES.some((vendorType) => vendorType === value);
}

// Both the simulator and the receiver live in this codebase, so this secret
// only demonstrates the signature-verification pattern; it protects nothing
// a real third party could otherwise forge.
export const VENDOR_WEBHOOK_SECRET = 'mock-vendor-webhook-secret';

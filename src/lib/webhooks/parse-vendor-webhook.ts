import { type VendorType, isVendorType } from '@/constants/vendor-webhook';

export interface VendorWebhookEvent {
  vendor: VendorType;
  jobId: string;
  status: string;
}

export function parseVendorWebhook(body: unknown): VendorWebhookEvent | null {
  if (typeof body !== 'object' || body === null) {
    return null;
  }

  const record = body as Record<string, unknown>;
  if (
    typeof record.vendor !== 'string' ||
    !isVendorType(record.vendor) ||
    typeof record.jobId !== 'string' ||
    typeof record.status !== 'string'
  ) {
    return null;
  }

  return {
    vendor: record.vendor,
    jobId: record.jobId,
    status: record.status,
  };
}

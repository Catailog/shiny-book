import { z } from 'zod';

import { VENDOR_TYPES } from '@/constants/vendor-webhook';

export const simulateVendorWebhookRequestSchema = z.object({
  vendor: z.enum([VENDOR_TYPES.PRINT_SHOP, VENDOR_TYPES.COURIER]),
  jobId: z.string(),
  status: z.string(),
});

export type SimulateVendorWebhookRequest = z.infer<typeof simulateVendorWebhookRequestSchema>;

import { describe, expect, it } from 'vitest';

import { parseVendorWebhook } from '@/lib/webhooks/parse-vendor-webhook';

describe('parseVendorWebhook', () => {
  it('parses a valid print-shop event', () => {
    const result = parseVendorWebhook({ vendor: 'print-shop', jobId: 'job-1', status: 'done' });
    expect(result).toEqual({ vendor: 'print-shop', jobId: 'job-1', status: 'done' });
  });

  it('parses a valid courier event', () => {
    const result = parseVendorWebhook({ vendor: 'courier', jobId: 'job-2', status: 'delivered' });
    expect(result).toEqual({ vendor: 'courier', jobId: 'job-2', status: 'delivered' });
  });

  it('returns null for an unknown vendor', () => {
    expect(
      parseVendorWebhook({ vendor: 'unknown-vendor', jobId: 'job-1', status: 'done' }),
    ).toBeNull();
  });

  it('returns null for a non-object body', () => {
    expect(parseVendorWebhook('not an object')).toBeNull();
    expect(parseVendorWebhook(null)).toBeNull();
  });

  it('returns null when a required field is missing', () => {
    expect(parseVendorWebhook({ vendor: 'print-shop', jobId: 'job-1' })).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';

import { isPrintJobStatus } from '@/constants/print-job-status';

describe('isPrintJobStatus', () => {
  it('accepts known print job statuses', () => {
    expect(isPrintJobStatus('received')).toBe(true);
    expect(isPrintJobStatus('printing')).toBe(true);
    expect(isPrintJobStatus('done')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isPrintJobStatus('shipped')).toBe(false);
    expect(isPrintJobStatus('')).toBe(false);
  });
});

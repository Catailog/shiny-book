import { describe, expect, it } from 'vitest';

import { resolveRequestId } from '@/lib/log/resolve-request-id';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('resolveRequestId', () => {
  it('reuses a sane inbound header', () => {
    expect(resolveRequestId('abc123-def456')).toBe('abc123-def456');
  });

  it('trims surrounding whitespace before reuse', () => {
    expect(resolveRequestId('  req-1  ')).toBe('req-1');
  });

  it('generates a uuid when the header is missing', () => {
    expect(resolveRequestId(null)).toMatch(UUID_PATTERN);
    expect(resolveRequestId(undefined)).toMatch(UUID_PATTERN);
  });

  it('generates a uuid when the header is empty or whitespace only', () => {
    expect(resolveRequestId('')).toMatch(UUID_PATTERN);
    expect(resolveRequestId('   ')).toMatch(UUID_PATTERN);
  });

  it('rejects an overlong header', () => {
    expect(resolveRequestId('x'.repeat(201))).toMatch(UUID_PATTERN);
  });

  it('rejects headers with non-printable characters', () => {
    expect(resolveRequestId('req\n1')).toMatch(UUID_PATTERN);
    expect(resolveRequestId('req\t1')).toMatch(UUID_PATTERN);
  });

  it('generates a distinct id on each call without a header', () => {
    expect(resolveRequestId(null)).not.toBe(resolveRequestId(null));
  });
});

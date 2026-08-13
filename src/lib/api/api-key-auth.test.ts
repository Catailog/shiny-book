import { describe, expect, it, vi } from 'vitest';

const maybeSingleMock = vi.fn();

vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          is: () => ({
            maybeSingle: maybeSingleMock,
          }),
        }),
      }),
    }),
  }),
}));

const { API_ERROR_CODES } = await import('@/constants/api-errors');
const { authenticateApiKey, extractBearerToken, hashApiKey } =
  await import('@/lib/api/api-key-auth');

describe('extractBearerToken', () => {
  it('extracts the token from a valid Bearer header', () => {
    expect(extractBearerToken('Bearer abc123')).toBe('abc123');
  });

  it('returns null when the header is missing', () => {
    expect(extractBearerToken(null)).toBeNull();
  });

  it('returns null when the scheme is not Bearer', () => {
    expect(extractBearerToken('Basic abc123')).toBeNull();
  });

  it('returns null when the token is empty', () => {
    expect(extractBearerToken('Bearer ')).toBeNull();
  });
});

describe('hashApiKey', () => {
  it('produces a deterministic 64-character hex digest', () => {
    const hash = hashApiKey('test-key');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hashApiKey('test-key')).toBe(hash);
  });

  it('produces different digests for different inputs', () => {
    expect(hashApiKey('key-a')).not.toBe(hashApiKey('key-b'));
  });
});

describe('authenticateApiKey', () => {
  it('rejects when the authorization header is missing', async () => {
    const request = new Request('https://example.com');
    const result = await authenticateApiKey(request);
    expect(result).toEqual({ isAuthorized: false, errorCode: API_ERROR_CODES.UNAUTHORIZED });
  });

  it('rejects when the authorization scheme is not Bearer', async () => {
    const request = new Request('https://example.com', {
      headers: { authorization: 'Basic abc123' },
    });
    const result = await authenticateApiKey(request);
    expect(result).toEqual({ isAuthorized: false, errorCode: API_ERROR_CODES.UNAUTHORIZED });
  });

  it('authorizes when the key hash matches an active api key', async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { id: 'client-1', client_name: 'test-client-web', role: 'consumer' },
      error: null,
    });

    const request = new Request('https://example.com', {
      headers: { authorization: 'Bearer valid-key' },
    });
    const result = await authenticateApiKey(request);

    expect(result).toEqual({
      isAuthorized: true,
      clientId: 'client-1',
      clientName: 'test-client-web',
      role: 'consumer',
    });
  });

  it('rejects when the stored role is not a recognized role', async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { id: 'client-1', client_name: 'test-client-web', role: 'superuser' },
      error: null,
    });

    const request = new Request('https://example.com', {
      headers: { authorization: 'Bearer valid-key' },
    });
    const result = await authenticateApiKey(request);

    expect(result).toEqual({ isAuthorized: false, errorCode: API_ERROR_CODES.UNAUTHORIZED });
  });

  it('rejects when no matching api key is found', async () => {
    maybeSingleMock.mockResolvedValueOnce({ data: null, error: null });

    const request = new Request('https://example.com', {
      headers: { authorization: 'Bearer unknown-key' },
    });
    const result = await authenticateApiKey(request);

    expect(result).toEqual({ isAuthorized: false, errorCode: API_ERROR_CODES.UNAUTHORIZED });
  });

  it('rejects when the query returns an error', async () => {
    maybeSingleMock.mockResolvedValueOnce({ data: null, error: new Error('db error') });

    const request = new Request('https://example.com', {
      headers: { authorization: 'Bearer valid-key' },
    });
    const result = await authenticateApiKey(request);

    expect(result).toEqual({ isAuthorized: false, errorCode: API_ERROR_CODES.UNAUTHORIZED });
  });
});

import { createHash } from 'node:crypto';
import 'server-only';

import { API_ERROR_CODES, type ApiErrorCode } from '@/constants/api-errors';
import { type Role, isRole } from '@/constants/roles';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

interface ApiKeyAuthSuccess {
  isAuthorized: true;
  clientId: string;
  clientName: string;
  role: Role;
}

interface ApiKeyAuthFailure {
  isAuthorized: false;
  errorCode: ApiErrorCode;
}

export type ApiKeyAuthResult = ApiKeyAuthSuccess | ApiKeyAuthFailure;

export function hashApiKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex');
}

export function extractBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}

export async function authenticateApiKey(request: Request): Promise<ApiKeyAuthResult> {
  const rawKey = extractBearerToken(request.headers.get('authorization'));

  if (!rawKey) {
    return { isAuthorized: false, errorCode: API_ERROR_CODES.UNAUTHORIZED };
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, client_name, role')
    .eq('key_hash', hashApiKey(rawKey))
    .is('revoked_at', null)
    .maybeSingle();

  if (error || !data || !isRole(data.role)) {
    return { isAuthorized: false, errorCode: API_ERROR_CODES.UNAUTHORIZED };
  }

  return { isAuthorized: true, clientId: data.id, clientName: data.client_name, role: data.role };
}

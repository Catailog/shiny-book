import { NextResponse } from 'next/server';

import { API_ERROR_HTTP_STATUS, type ApiErrorCode } from '@/constants/api-errors';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

export function apiError(code: ApiErrorCode, message: string) {
  return NextResponse.json(
    { data: null, error: { code, message } },
    { status: API_ERROR_HTTP_STATUS[code] },
  );
}

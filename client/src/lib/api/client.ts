import { API_BASE_URL } from '@/lib/config';
import type { ApiErrorBody, ApiErrorDetail, ErrorCode } from '@/types/api';

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    /** Known codes are typed; anything new the API sends still passes through as a string. */
    readonly code: ErrorCode | (string & {}),
    message: string,
    readonly details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null) return false;
  const body = value as Record<string, unknown>;
  return typeof body.error === 'string' && typeof body.code === 'string';
}

type QueryValue = string | number | undefined;

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiRequestError(0, 'CONFIG_ERROR', 'NEXT_PUBLIC_API_BASE_URL is not set');
  }

  const url = new URL(path, API_BASE_URL);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: options.body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: 'no-store',
    });
  } catch (cause) {
    throw new ApiRequestError(0, 'NETWORK_ERROR', cause instanceof Error ? cause.message : 'Network error');
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isApiErrorBody(payload)) {
      throw new ApiRequestError(response.status, payload.code, payload.error, payload.details);
    }
    throw new ApiRequestError(response.status, 'UNKNOWN_ERROR', `HTTP ${response.status}`);
  }

  return payload as T;
}

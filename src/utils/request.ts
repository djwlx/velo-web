export const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api'
  : '/api';

export type RequestErrorType = 'network' | 'http' | 'business';

export class RequestError extends Error {
  type: RequestErrorType;
  status?: number;
  code?: number;

  constructor(
    message: string,
    type: RequestErrorType,
    status?: number,
    code?: number
  ) {
    super(message);

    this.name = 'RequestError';
    this.type = type;
    this.status = status;
    this.code = code;
  }
}

export interface BaseResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export async function request<T>(
  url: string,
  options?: RequestInit
): Promise<BaseResponse<T>> {
  let response: Response;
  const token = localStorage.getItem('velo_access_token');
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type') && options?.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  try {
    response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
  } catch (error) {
    throw new RequestError(
      error instanceof Error ? error.message : 'Network error',
      'network'
    );
  }

  let result: BaseResponse<T>;
  try {
    result = await response.json();
  } catch {
    if (!response.ok) {
      throw new RequestError(`HTTP ${response.status}`, 'http', response.status);
    }
    throw new RequestError('Invalid response', 'http', response.status);
  }

  // 业务错误
  if (result.code !== 0) {
    throw new RequestError(
      result.message ?? `Business error: ${result.code}`,
      'business',
      response.ok ? undefined : response.status,
      result.code
    );
  }

  if (!response.ok) {
    throw new RequestError(`HTTP ${response.status}`, 'http', response.status);
  }

  return result;
}

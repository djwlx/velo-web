export const API_BASE_URL = 'http://localhost:3000/api';

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

  try {
    response = await fetch(`${API_BASE_URL}${url}`, options);
  } catch (error) {
    throw new RequestError(
      error instanceof Error ? error.message : 'Network error',
      'network'
    );
  }

  // HTTP 错误
  if (!response.ok) {
    throw new RequestError(`HTTP ${response.status}`, 'http', response.status);
  }

  const result: BaseResponse<T> = await response.json();

  // 业务错误
  if (result.code !== 0) {
    throw new RequestError(
      result.message ?? `Business error: ${result.code}`,
      'business',
      undefined,
      result.code
    );
  }

  return result;
}

import { ErrorObject } from '@/shared/types.ts';

const API_URL = 'http://localhost:8080';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export const api = {
  async request<T>(endpointSegments: unknown[] | string, options: RequestOptions = {}): Promise<T> {
    const endpoint = Array.isArray(endpointSegments)
      ? endpointSegments.map((segment) => String(segment)).join('/')
      : endpointSegments;

    const { method = 'GET', params = {}, body, headers = {} } = options;

    const searchParams = new URLSearchParams();
    Object.entries(params)?.forEach(([param, value]) => searchParams.append(param, String(value)));

    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}${searchParams.size ? `?${searchParams}` : ''}`;

    if (body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        throw {
          statusCode: 401,
          messages: ['Authentication required. Please log in.'],
          timestamp: new Date().toISOString(),
        } satisfies ErrorObject;
      }

      const errorData = await response.json();
      throw {
        statusCode: response.status,
        messages: errorData.messages || [errorData.message || 'Unknown error'],
        timestamp: errorData.timestamp || new Date().toISOString(),
      } satisfies ErrorObject;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  },

  get<T>(endpointSegments: unknown[] | string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpointSegments, { ...options, method: 'GET' });
  },

  post<T>(endpointSegments: unknown[] | string, options?: Omit<RequestOptions, 'method'>) {
    return this.request<T>(endpointSegments, { ...options, method: 'POST' });
  },

  put<T>(endpointSegments: unknown[] | string, options?: Omit<RequestOptions, 'method'>) {
    return this.request<T>(endpointSegments, { ...options, method: 'PUT' });
  },

  delete<T>(endpointSegments: unknown[] | string, options?: Omit<RequestOptions, 'method'>) {
    return this.request<T>(endpointSegments, { ...options, method: 'DELETE' });
  },
};

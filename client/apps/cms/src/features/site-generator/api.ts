import { api } from '@/shared/api';
import {
  SiteGeneration,
  SiteGenerationSummary,
} from '@/features/site-generator/domain/site-generator';
import { SiteGenerationSettings } from '@/features/site-generator/domain/site-generation-settings';

export const SITE_GENERATOR_ENDPOINT = '/site-generations';

export const siteGeneratorApi = {
  getGenerations: () => api.get<SiteGenerationSummary[]>(SITE_GENERATOR_ENDPOINT),

  getCurrentGeneration: () =>
    api.get<SiteGenerationSummary | null>([SITE_GENERATOR_ENDPOINT, 'current']),

  getGeneration: (id: number) => api.get<SiteGeneration>([SITE_GENERATOR_ENDPOINT, id]),

  triggerGeneration: () => api.post<SiteGeneration>(SITE_GENERATOR_ENDPOINT),

  deleteGeneration: (id: number) => api.delete<void>([SITE_GENERATOR_ENDPOINT, id]),

  retryGeneration: (id: number) => api.post<SiteGeneration>([SITE_GENERATOR_ENDPOINT, id, 'retry']),

  downloadGeneration: (id: number) => api.download([SITE_GENERATOR_ENDPOINT, id, 'download']),

  getSettings: () => api.get<SiteGenerationSettings>([SITE_GENERATOR_ENDPOINT, 'settings']),

  getIcon: async (): Promise<Blob> => {
    const endpoint = [SITE_GENERATOR_ENDPOINT, 'settings', 'icon']
      .map((segment) => String(segment))
      .join('/');
    const url = `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        statusCode: response.status,
        messages: errorData.messages || [errorData.message || 'Unknown error'],
        timestamp: errorData.timestamp || new Date().toISOString(),
      };
    }

    return response.blob();
  },

  updateTitle: (title: string) =>
    api.put<void>([SITE_GENERATOR_ENDPOINT, 'settings', 'title'], { body: { title } }),

  uploadIcon: async (file: File) => {
    const endpoint = [SITE_GENERATOR_ENDPOINT, 'settings', 'icon']
      .map((segment) => String(segment))
      .join('/');
    const url = `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        statusCode: response.status,
        messages: errorData.messages || [errorData.message || 'Unknown error'],
        timestamp: errorData.timestamp || new Date().toISOString(),
      };
    }

    return;
  },

  removeIcon: async () => {
    const endpoint = [SITE_GENERATOR_ENDPOINT, 'settings', 'icon']
      .map((segment) => String(segment))
      .join('/');
    const url = `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        statusCode: response.status,
        messages: errorData.messages || [errorData.message || 'Unknown error'],
        timestamp: errorData.timestamp || new Date().toISOString(),
      };
    }

    return;
  },
};

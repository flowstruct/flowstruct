import { api } from '@/shared/api';
import { SiteGeneration, SiteGenerationSummary } from '@/features/site-generator/domain/site-generator';

export const SITE_GENERATOR_ENDPOINT = '/site-generations';

export const siteGeneratorApi = {
  getGenerations: () => api.get<SiteGenerationSummary[]>(SITE_GENERATOR_ENDPOINT),

  getCurrentGeneration: () => api.get<SiteGenerationSummary | null>([SITE_GENERATOR_ENDPOINT, 'current']),

  getGeneration: (id: number) => api.get<SiteGeneration>([SITE_GENERATOR_ENDPOINT, id]),

  triggerGeneration: () => api.post<SiteGeneration>(SITE_GENERATOR_ENDPOINT),

  deleteGeneration: (id: number) => api.delete<void>([SITE_GENERATOR_ENDPOINT, id]),

  retryGeneration: (id: number) => api.post<SiteGeneration>([SITE_GENERATOR_ENDPOINT, id, 'retry']),

  downloadGeneration: (id: number) => api.download([SITE_GENERATOR_ENDPOINT, id, 'download']),
};
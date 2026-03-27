import { queryOptions } from '@tanstack/react-query';
import { siteGeneratorApi } from '@/features/site-generator/api';
import { SiteGenerationSummary } from '@/features/site-generator/domain/site-generator';

export const siteGeneratorKeys = {
  all: ['site-generations'] as const,
  collection: () => [...siteGeneratorKeys.all, 'list'] as const,
  details: () => [...siteGeneratorKeys.all, 'detail'] as const,
  detail: (id: number) => [...siteGeneratorKeys.details(), id] as const,
  current: () => [...siteGeneratorKeys.all, 'current'] as const,
  settings: () => [...siteGeneratorKeys.all, 'settings'] as const,
  settingsIcon: () => [...siteGeneratorKeys.all, 'settings-icon'] as const,
};

export const siteGeneratorQueries = {
  collection: queryOptions({
    queryKey: siteGeneratorKeys.collection(),
    queryFn: () => siteGeneratorApi.getGenerations(),
    select: (data) => ({
      list: data,
      byIds: Object.fromEntries(data.map((d) => [d.id, d])),
    }),
  }),

  detail: (id: number) =>
    queryOptions({
      queryKey: siteGeneratorKeys.detail(id),
      queryFn: () => siteGeneratorApi.getGeneration(id),
    }),

  current: queryOptions({
    queryKey: siteGeneratorKeys.current(),
    queryFn: () => siteGeneratorApi.getCurrentGeneration(),
    refetchInterval: (query) => {
      const data: SiteGenerationSummary = query.state.data;

      if (data?.status === 'PENDING' || data?.status === 'RUNNING') {
        return 1000;
      }

      return false;
    },
  }),

  settings: queryOptions({
    queryKey: siteGeneratorKeys.settings(),
    queryFn: () => siteGeneratorApi.getSettings(),
  }),

  settingsIcon: queryOptions({
    queryKey: siteGeneratorKeys.settingsIcon(),
    queryFn: () => siteGeneratorApi.getIcon(),
  }),
};

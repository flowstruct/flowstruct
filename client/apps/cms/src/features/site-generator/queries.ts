import { queryOptions } from '@tanstack/react-query';
import { siteGeneratorApi } from '@/features/site-generator/api';
import { GenerationStatus } from '@/features/site-generator/domain/site-generator';

export const siteGeneratorKeys = {
  all: ['site-generations'] as const,
  collection: () => [...siteGeneratorKeys.all, 'list'] as const,
  details: () => [...siteGeneratorKeys.all, 'detail'] as const,
  detail: (id: number) => [...siteGeneratorKeys.details(), id] as const,
  current: () => [...siteGeneratorKeys.all, 'current'] as const,
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
      const data = query.state.data;
      if (data?.status === 'PENDING' || data?.status === 'RUNNING') {
        return 3000;
      }
      return false;
    },
  }),
};

export function isActiveGeneration(status: GenerationStatus | undefined): boolean {
  return status === 'PENDING' || status === 'RUNNING';
}
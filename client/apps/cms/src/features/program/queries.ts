import { queryOptions } from '@tanstack/react-query';
import { programApi } from '@/features/program/api.ts';

export const programKeys = {
  all: ['programs'] as const,
  list: () => [...programKeys.all, 'list'] as const,
  details: () => [...programKeys.all, 'detail'] as const,
  detail: (id: number) => [...programKeys.details(), id] as const,
};

export const programQueries = {
  collection: queryOptions({
    queryKey: programKeys.list(),
    queryFn: () => programApi.getPrograms(),
    select: (data) => ({
      list: data,
      byIds: Object.fromEntries(data.map((d) => [d.id, d])),
    }),
  }),
};

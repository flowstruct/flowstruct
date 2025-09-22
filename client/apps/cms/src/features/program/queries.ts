import { queryOptions } from '@tanstack/react-query';
import { programApi } from '@/features/program/api.ts';

export const programKeys = {
  all: ['programs'] as const,
  list: () => [...programKeys.all, 'list'] as const,
  details: () => [...programKeys.all, 'detail'] as const,
  detail: (id: number) => [...programKeys.details(), id] as const,
};

export const programQueries = {
  list: queryOptions({
    queryKey: programKeys.list(),
    queryFn: () => programApi.getPrograms(),
  }),

  detail: (programId: number) =>
    queryOptions({
      queryKey: programKeys.detail(programId),
      queryFn: () => programApi.getProgram(programId),
    }),
};

import { queryOptions } from '@tanstack/react-query';
import { PROGRAM_ENDPOINT } from '@/features/program/constants.ts';
import { api } from '@/shared/api.ts';
import { Program } from '@/features/program/types.ts';

export const programKeys = {
  all: ['programs'] as const,
  list: () => [...programKeys.all, 'list'] as const,
  details: () => [...programKeys.all, 'detail'] as const,
  detail: (id: number) => [...programKeys.details(), id] as const,
};

export const ProgramListQuery = queryOptions({
  queryKey: programKeys.list(),
  queryFn: () => api.get<Program[]>(PROGRAM_ENDPOINT),
});

export const ProgramQuery = (programId: number) =>
  queryOptions({
    queryKey: programKeys.detail(programId),
    queryFn: () => api.get<Program>([PROGRAM_ENDPOINT, programId.toString()]),
  });

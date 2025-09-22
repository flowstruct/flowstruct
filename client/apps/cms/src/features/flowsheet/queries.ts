import { queryOptions } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';

export const flowsheetKeys = {
  all: ['study-plans'] as const,
  list: () => [...flowsheetKeys.all, 'list'] as const,
  details: () => [...flowsheetKeys.all, 'detail'] as const,
  detail: (id: number) => [...flowsheetKeys.details(), id] as const,
  courseLists: () => [...flowsheetKeys.all, 'courses'] as const,
  courseList: (flowsheetId: number) => [...flowsheetKeys.courseLists(), flowsheetId] as const,
  programs: () => [...flowsheetKeys.all, 'programs'] as const,
  program: (flowsheetId: number) => [...flowsheetKeys.programs(), flowsheetId] as const,
};

export const flowsheetQueries = {
  list: queryOptions({
      queryKey: flowsheetKeys.list(),
      queryFn: () => flowsheetApi.getFlowsheets(),
    }),

  detail: (flowsheetId: number) =>
    queryOptions({
      queryKey: flowsheetKeys.detail(flowsheetId),
      queryFn: () => flowsheetApi.getFlowsheet(flowsheetId),
    }),
};

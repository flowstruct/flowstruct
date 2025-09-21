import { queryOptions } from '@tanstack/react-query';
import { api } from '@/shared/api.ts';
import { Flowsheet, FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet.ts';

export const FLOWSHEET_ENDPOINT = '/study-plans';

export const FlowsheetKeys = {
  all: ['study-plans'] as const,
  list: () => [...FlowsheetKeys.all, 'list'] as const,
  details: () => [...FlowsheetKeys.all, 'detail'] as const,
  detail: (id: number) => [...FlowsheetKeys.details(), id] as const,
  courseLists: () => [...FlowsheetKeys.all, 'courses'] as const,
  courseList: (flowsheetId: number) => [...FlowsheetKeys.courseLists(), flowsheetId] as const,
  programs: () => [...FlowsheetKeys.all, 'programs'] as const,
  program: (flowsheetId: number) => [...FlowsheetKeys.programs(), flowsheetId] as const,
};

export const FlowsheetListQuery = queryOptions({
  queryKey: FlowsheetKeys.list(),
  queryFn: () => api.get<FlowsheetSummary[]>(FLOWSHEET_ENDPOINT),
});

export const FlowsheetQuery = (flowsheetId: number) =>
  queryOptions({
    queryKey: FlowsheetKeys.detail(flowsheetId),
    queryFn: () => api.get<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId]),
  });

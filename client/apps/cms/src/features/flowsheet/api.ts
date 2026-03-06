import { api } from '@/shared/api.ts';
import { Flowsheet, FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet.ts';

export const FLOWSHEET_ENDPOINT = '/flowsheets';

export const flowsheetApi = {
  getFlowsheets: () => api.get<FlowsheetSummary[]>(FLOWSHEET_ENDPOINT),

  getFlowsheet: (flowsheetId: number) => api.get<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId]),

  createFlowsheet: (details: Partial<Flowsheet>) =>
    api.post<Flowsheet>([FLOWSHEET_ENDPOINT], {
      body: details,
    }),

  placeCourses: ({
    flowsheetId,
    courseIds,
    term,
  }: {
    flowsheetId: number;
    courseIds: number[];
    term: number;
  }) =>
    api.post<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'terms', term], {
      params: {
        courseIds,
      },
    }),

  removeCourses: ({ flowsheetId, courseIds }: { flowsheetId: number; courseIds: number[] }) =>
    api.delete<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'terms'], {
      params: {
        courseIds,
      },
    }),

  moveCourse: ({
    flowsheetId,
    courseId,
    term,
    position,
  }: {
    flowsheetId: number;
    courseId: number;
    term: number;
    position: number;
  }) =>
    api.put<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'terms', term], {
      params: {
        courseId,
        position,
      },
    }),

  addTerm: ({ flowsheetId }: { flowsheetId: number }) =>
    api.post<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'terms']),

  deleteTerm: ({ flowsheetId, termId }: { flowsheetId: number; termId: number }) =>
    api.delete<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'terms', termId]),

  linkPrerequisites: ({
    flowsheetId,
    courseId,
    prerequisiteIds,
  }: {
    flowsheetId: number;
    courseId: number;
    prerequisiteIds: number[];
  }) =>
    api.post<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'graph', courseId, 'prerequisites'], {
      params: { prerequisiteIds },
    }),

  unlinkPrerequisites: ({
    flowsheetId,
    courseId,
    prerequisiteIds,
  }: {
    flowsheetId: number;
    courseId: number;
    prerequisiteIds: number[];
  }) =>
    api.delete<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'graph', courseId, 'prerequisites'], {
      params: { prerequisiteIds },
    }),
};

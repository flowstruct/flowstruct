import { api } from '@/shared/api';
import { Flowsheet, FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet';

export const FLOWSHEET_ENDPOINT = '/flowsheets';

export const flowsheetApi = {
  getFlowsheets: () => api.get<FlowsheetSummary[]>(FLOWSHEET_ENDPOINT),

  getFlowsheet: (flowsheetId: number) => api.get<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId]),

  createFlowsheet: (details: Partial<Flowsheet>) =>
    api.post<Flowsheet>([FLOWSHEET_ENDPOINT], {
      body: details,
    }),

  archiveFlowsheet: (flowsheetId: number) =>
    api.put<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'archive']),

  unarchiveFlowsheet: (flowsheetId: number) =>
    api.put<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'unarchive']),

  cloneFlowsheet: ({
    flowsheetId,
    details,
  }: {
    flowsheetId: number;
    details: Partial<Flowsheet>;
  }) =>
    api.post<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'clone'], {
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
    api.delete<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'terms', 'placements'], {
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

  deleteLastTerm: ({ flowsheetId }: { flowsheetId: number }) =>
    api.delete<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'terms']),

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

  linkCorequisites: ({
    flowsheetId,
    courseId,
    corequisiteIds,
  }: {
    flowsheetId: number;
    courseId: number;
    corequisiteIds: number[];
  }) =>
    api.post<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'graph', courseId, 'corequisites'], {
      params: { corequisiteIds },
    }),

  unlinkCorequisites: ({
    flowsheetId,
    courseId,
    corequisiteIds,
  }: {
    flowsheetId: number;
    courseId: number;
    corequisiteIds: number[];
  }) =>
    api.delete<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'graph', courseId, 'corequisites'], {
      params: { corequisiteIds },
    }),

  approveChanges: (flowsheetId: number) =>
    api.put<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'approve-changes']),

  discardChanges: (flowsheetId: number) =>
    api.put<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId, 'discard-changes']),

  editFlowsheetDetails: (flowsheetId: number, details: Partial<Flowsheet>) =>
    api.put<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId], { body: details }),
};

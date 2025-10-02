import { api } from '@/shared/api.ts';
import { Flowsheet, FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet.ts';

export const FLOWSHEET_ENDPOINT = '/study-plans';

export const flowsheetApi = {
  getFlowsheets: () => api.get<FlowsheetSummary[]>(FLOWSHEET_ENDPOINT),
  getFlowsheet: (flowsheetId: number) => api.get<Flowsheet>([FLOWSHEET_ENDPOINT, flowsheetId]),
  createFlowsheet: (details: Partial<Flowsheet>) =>
    api.post<Flowsheet>([FLOWSHEET_ENDPOINT], {
      body: details,
    }),
};

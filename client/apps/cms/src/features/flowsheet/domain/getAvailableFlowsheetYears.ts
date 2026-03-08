import { FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet';

export const getAvailableFlowsheetYears = (flowsheets: FlowsheetSummary[]) => {
  const years = [...new Set(flowsheets.map((fs) => fs.year))];
  return years.sort((a, b) => a - b);
};

import { FlowsheetSummary, ArchiveStatus } from '@/features/flowsheet/domain/flowsheet.ts';

export const getFlowsheetsByArchiveStatus = (flowsheets: FlowsheetSummary[], option: ArchiveStatus) => {
  switch (option) {
    case 'active':
      return flowsheets.filter((f) => f.archivedAt !== undefined);
    case 'archived':
      return flowsheets.filter((f) => f.archivedAt === undefined);
    default:
      return flowsheets;
  }
};

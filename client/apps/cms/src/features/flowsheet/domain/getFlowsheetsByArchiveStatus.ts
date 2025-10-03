import { ArchiveStatus, FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet.ts';

export const getFlowsheetsByArchiveStatus = (
  flowsheets: FlowsheetSummary[],
  archiveStatus: ArchiveStatus
) => {
  switch (archiveStatus) {
    case 'active':
      return flowsheets.filter((f) => f.archivedAt !== undefined);
    case 'archived':
      return flowsheets.filter((f) => f.archivedAt === undefined);
    default:
      return flowsheets;
  }
};

import { ArchiveStatus, FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet';

export const getFlowsheetsByArchiveStatus = (
  flowsheets: FlowsheetSummary[],
  archiveStatus: ArchiveStatus
) => {
  switch (archiveStatus) {
    case 'active':
      return flowsheets.filter((f) => f.archivedAt == null);
    case 'archived':
      return flowsheets.filter((f) => f.archivedAt != null);
    default:
      return flowsheets;
  }
};

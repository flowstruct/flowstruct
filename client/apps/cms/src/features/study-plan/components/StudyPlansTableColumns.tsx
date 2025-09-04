import { createColumnHelper } from '@tanstack/react-table';
import { StudyPlanRow } from '@/features/study-plan/types.ts';
import { StudyPlanTableOptionsMenu } from '@/features/study-plan/components/StudyPlanTableOptionsMenu.tsx';
import { ApprovalStatusBadge } from '@/shared/components/ApprovalStatusBadge.tsx';
import { LastUpdatedStats } from '@/shared/components/LastUpdatedStats.tsx';
import { ArchiveStatusBadge } from '@/shared/components/ArchiveStatusBadge.tsx';
import { ActionIcon, Group } from '@mantine/core';
import { ArrowDownUp } from 'lucide-react';

export function getStudyPlansTableColumns() {
  const { accessor, display } = createColumnHelper<StudyPlanRow>();

  return [
    accessor('archivedAt', {
      header: '',
      cell: ({ row }) => <ArchiveStatusBadge archivedAt={row.original.archivedAt} />,
      enableColumnFilter: true,
      filterFn: (row, _columnId, filterValue) => {
        if (filterValue === 'active') {
          return row.original.archivedAt === null;
        }

        if (filterValue === 'archived') {
          return row.original.archivedAt !== null;
        }

        return true;
      },
    }),
    accessor('programName', {
      header: 'Program',
      enableColumnFilter: true,
      filterFn: 'equalsString',
    }),
    accessor('year', {
      header: ({ column }) => (
        <Group wrap="nowrap">
          <ActionIcon variant="transparent" onClick={() => column.toggleSorting()} size="xs">
            <ArrowDownUp size={14} />
          </ActionIcon>
          Year
        </Group>
      ),
      cell: ({ row }) => (
        <p style={{ textWrap: 'nowrap' }}>
          {row.original.year} - {row.original.year + 1}
        </p>
      ),
      enableColumnFilter: true,
      filterFn: 'equals',
      sortingFn: 'basic',
    }),
    accessor('track', {
      header: 'Track',
      cell: ({ row }) => (row.getValue('track') === '' ? '---' : row.getValue('track')),
    }),
    accessor('status', {
      header: 'Status',
      cell: ({ row }) => ApprovalStatusBadge(row.getValue('status')),
    }),
    accessor('updatedAt', {
      header: ({ column }) => (
        <Group wrap="nowrap">
          <ActionIcon variant="transparent" onClick={() => column.toggleSorting()} size="xs">
            <ArrowDownUp size={14} />
          </ActionIcon>
          Last Updated
        </Group>
      ),
      cell: ({ row }) => (
        <LastUpdatedStats at={row.original.updatedAt} by={row.original.updatedBy} />
      ),
      sortingFn: 'datetime',
    }),
    display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => <StudyPlanTableOptionsMenu studyPlan={row.original} />,
    }),
  ];
}

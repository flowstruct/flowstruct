import { createColumnHelper } from '@tanstack/react-table';
import { Program } from '@/features/program/types.ts';
import { ProgramTableOptionsMenu } from '@/features/program/components/ProgramTableOptionsMenu.tsx';
import { ActionIcon, Badge, Group } from '@mantine/core';
import { LastUpdatedStats } from '@/shared/components/LastUpdatedStats.tsx';
import { ArrowDownUp } from 'lucide-react';
import { OutdatedStatusBadge } from '@/shared/components/OutdatedStatusBadge.tsx';

export function getProgramsTableColumns() {
  const { display, accessor } = createColumnHelper<Program>();

  return [
    accessor('outdatedAt', {
      header: '',
      cell: ({ row }) => (
        <OutdatedStatusBadge
          outdatedAt={row.original.outdatedAt}
          outdatedBy={row.original.outdatedBy}
          entityType="program"
        />
      ),
      enableColumnFilter: true,
      filterFn: (row, _columnId, filterValue) => {
        if (filterValue === 'active') {
          return row.original.outdatedAt === null;
        }

        if (filterValue === 'outdated') {
          return row.original.outdatedAt !== null;
        }

        return true;
      },
    }),
    accessor('code', {
      header: ({ column }) => (
        <Group wrap="nowrap">
          <ActionIcon variant="transparent" onClick={() => column.toggleSorting()} size="xs">
            <ArrowDownUp size={14} />
          </ActionIcon>
          Code
        </Group>
      ),
      cell: ({ cell }) => <Badge variant="default">{cell.getValue()}</Badge>,
      sortingFn: 'alphanumeric',
    }),
    accessor('name', {
      header: 'Name',
    }),
    accessor('degree', {
      header: 'Degree',
      enableColumnFilter: true,
      filterFn: 'equalsString',
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
      cell: ({ row }) => <ProgramTableOptionsMenu program={row.original} />,
    }),
  ];
}

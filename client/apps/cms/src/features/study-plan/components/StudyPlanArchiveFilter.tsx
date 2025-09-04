import { Archive, ClipboardCheck } from 'lucide-react';
import { Center, SegmentedControl, Text } from '@mantine/core';
import { Table } from '@tanstack/react-table';

type Props<TData> = {
  table: Table<TData>;
};

export const ARCHIVE_FILTER = {
  ARCHIVED: 'archived' as const,
  ACTIVE: 'active' as const,
  ALL: 'all' as const,
};

export function StudyPlanArchiveFilter<TData>({ table }: Props<TData>) {
  const archivedAtColumn = table.getColumn('archivedAt');
  if (!archivedAtColumn) return;

  const handleArchiveFilterChange = (value: string) => {
    if (value === ARCHIVE_FILTER.ARCHIVED) {
      archivedAtColumn.setFilterValue(ARCHIVE_FILTER.ARCHIVED);
      return;
    }

    if (value === ARCHIVE_FILTER.ACTIVE) {
      archivedAtColumn.setFilterValue(ARCHIVE_FILTER.ACTIVE);
      return;
    }

    archivedAtColumn.setFilterValue(undefined);
  };

  return (
    <SegmentedControl
      value={(archivedAtColumn.getFilterValue() as string) ?? ARCHIVE_FILTER.ALL}
      onChange={handleArchiveFilterChange}
      data={[
        {
          value: 'all',
          label: <Text size="sm">All</Text>,
        },
        {
          value: 'active',
          label: (
            <Center style={{ gap: 10 }}>
              <ClipboardCheck size={16} />
              <Text size="sm">Active</Text>
            </Center>
          ),
        },
        {
          value: 'archived',
          label: (
            <Center style={{ gap: 10 }}>
              <Archive size={16} />
              <Text size="sm">Archived</Text>
            </Center>
          ),
        },
      ]}
    />
  );
}

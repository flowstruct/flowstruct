import { Archive, ClipboardCheck } from 'lucide-react';
import { Center, SegmentedControl, Text } from '@mantine/core';
import { Table } from '@tanstack/react-table';

type Props<TData> = {
  table: Table<TData>;
};

export const ARCHIVE_FILTER = {
  OUTDATED: 'outdated' as const,
  ACTIVE: 'active' as const,
  ALL: 'all' as const,
};

export function OutdatedFilter<TData>({ table }: Props<TData>) {
  const outdatedAtColumn = table.getColumn('outdatedAt');
  if (!outdatedAtColumn) return;

  const handleArchiveFilterChange = (value: string) => {
    if (value === ARCHIVE_FILTER.OUTDATED) {
      outdatedAtColumn.setFilterValue(ARCHIVE_FILTER.OUTDATED);
      return;
    }

    if (value === ARCHIVE_FILTER.ACTIVE) {
      outdatedAtColumn.setFilterValue(ARCHIVE_FILTER.ACTIVE);
      return;
    }

    outdatedAtColumn.setFilterValue(undefined);
  };

  return (
    <SegmentedControl
      value={(outdatedAtColumn.getFilterValue() as string) ?? ARCHIVE_FILTER.ALL}
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
          value: 'outdated',
          label: (
            <Center style={{ gap: 10 }}>
              <Archive size={16} />
              <Text size="sm">Outdated</Text>
            </Center>
          ),
        },
      ]}
    />
  );
}

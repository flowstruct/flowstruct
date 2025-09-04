import { DataTable } from '@/shared/components/DataTable.tsx';
import { useProgramList } from '@/features/program/hooks/useProgramList.ts';
import { getProgramsTableColumns } from '@/features/program/components/ProgramsTableColumns.tsx';
import { useDataTable } from '@/shared/hooks/useDataTable.ts';
import { Degree, Program } from '@/features/program/types.ts';
import { DataTableSearch } from '@/shared/components/DataTableSearch.tsx';
import { Button, Group, Stack } from '@mantine/core';
import React from 'react';
import { DataTablePagination } from '@/shared/components/DataTablePagination.tsx';
import { ColumnFilterSelect } from '@/shared/components/ColumnFilterSelect.tsx';
import { Album, Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { OutdatedFilter } from '@/shared/components/OutdatedFilter.tsx';
import { useTableSearch } from '@/shared/hooks/useTableSearch.ts';

export function ProgramsTable() {
  const { data } = useProgramList();
  const columns = React.useMemo(() => getProgramsTableColumns(), []);
  const table = useDataTable<Program>({
    data,
    columns,
    search: useTableSearch(),
    initialState: {
      sorting: [
        {
          id: 'updatedAt',
          desc: true,
        },
      ],
    },
  });

  return (
    <Stack gap="md">
      <Group>
        <OutdatedFilter table={table} />

        <DataTableSearch width={800} table={table} placeholder="Search any program..." />

        <ColumnFilterSelect
          table={table}
          columnId="degree"
          data={Object.entries(Degree).map(([key, value]) => ({
            value: key,
            label: `${value} (${key})`,
          }))}
          leftSection={<Album size={16} />}
          placeholder="Filter by degree..."
        />

        <Link to="/catalog/programs/new">
          <Button leftSection={<Plus size={18} />}>Create New Program</Button>
        </Link>
      </Group>

      <DataTable table={table} />

      <DataTablePagination table={table} />
    </Stack>
  );
}

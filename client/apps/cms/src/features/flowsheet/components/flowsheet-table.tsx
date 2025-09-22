import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet.ts';
import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';
import { programQueries } from '@/features/program/queries.ts';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import styles from '@/features/flowsheet/components/flowsheet-table.module.css';
import { DataTableToolbar } from '@/shared/components/data-table-toolbar.tsx';
import { DataTable } from '@/shared/components/data-table';
import { FlowsheetFilterMenu } from '@/features/flowsheet/components/flowsheet-filter-menu.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Table2 } from 'lucide-react';

export function FlowsheetTable() {
  const { data: flowsheets } = useSuspenseQuery(flowsheetQueries.list);
  const { data: programs } = useSuspenseQuery(programQueries.list);

  const { accessor } = createColumnHelper<FlowsheetSummary>();
  const columns = React.useMemo(
    () => [
      accessor('program', {
        header: 'Program',
        cell: ({ cell }) => {
          const flowsheetProgram = programs.find((p) => p.id === cell.getValue());
          return flowsheetProgram ? getProgramDisplayName(flowsheetProgram) : 'None';
        },
      }),
      accessor('year', {
        header: 'Year',
        cell: ({ cell }) => (
          <p className={styles.yearCell}>
            {cell.getValue()} - {cell.getValue() + 1}
          </p>
        ),
      }),
      accessor('track', {
        header: 'Track',
        cell: ({ cell }) => cell.getValue() ?? '---',
      }),
    ],
    [programs]
  );

  const table = useReactTable({
    data: flowsheets,
    columns,
    state: {
      grouping: ['program'],
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <DataTableToolbar>
        <FlowsheetFilterMenu table={table} />

        <Button size="sm">
          <Table2 size={14} /> Layout
        </Button>
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}

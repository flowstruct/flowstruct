import { createFileRoute } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header.tsx';
import { CircleDashed, CircleDot, Layers2, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button.tsx';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';
import { programQueries } from '@/features/program/queries.ts';
import { DataTable } from '@/shared/components/data-table/data-table.tsx';
import { useFlowsheetTable } from '@/features/flowsheet/hooks/use-flowsheet-table.ts';
import { DataTableToolbar } from '@/shared/components/data-table/data-table-toolbar.tsx';

export const Route = createFileRoute('/_app/flowsheets/')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(flowsheetQueries.list);
    queryClient.ensureQueryData(programQueries.collection);
  },
  component: () => {
    const table = useFlowsheetTable();

    return (
      <>
        <Header>
          <HeaderMain>
            <Button variant="flat" size="sm">
              <Layers2 size={14} /> All flowsheets
            </Button>

            <Button variant="flat" size="sm">
              <CircleDot size={14} /> Active
            </Button>

            <Button variant="flat" size="sm">
              <CircleDashed size={14} /> Archived
            </Button>
          </HeaderMain>

          <HeaderActions>
            <DataTableToolbar table={table} />

            <Button size="sm" variant="primary">
              <Plus size={15} /> New
            </Button>
          </HeaderActions>
        </Header>

        <DataTable table={table} />
      </>
    );
  },
});

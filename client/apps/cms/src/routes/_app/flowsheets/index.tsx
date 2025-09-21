import { createFileRoute, Link } from '@tanstack/react-router';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import {
  Breadcrumb,
  Breadcrumbs,
  Header,
  HeaderLeft,
  HeaderRight,
} from '@/shared/components/new/header.tsx';
import { Layers2, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui2/Button.tsx';
import { DataTable } from '@/shared/components/new/data-table.tsx';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useSuspenseQuery } from '@tanstack/react-query';
import { FlowsheetListQuery } from '@/features/flowsheet/queries/flowsheet.query.ts';
import React from 'react';
import { Flowsheet } from '@/features/flowsheet/domain/flowsheet.ts';

export const Route = createFileRoute('/_app/flowsheets/')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(FlowsheetListQuery);
  },
  component: () => (
    <div>
      <FlowsheetsHeader />
      <div>
        <FlowsheetsTable />
      </div>
    </div>
  ),
});

function FlowsheetsHeader() {
  return (
    <Header>
      <HeaderLeft>
        <Breadcrumbs>
          <Link to="/flowsheets" search={DefaultSearchValues()}>
            <Breadcrumb base>
              <Layers2 size={14} /> Flowsheets
            </Breadcrumb>
          </Link>
        </Breadcrumbs>
      </HeaderLeft>

      <HeaderRight>
        <Button variant="transparent">
          <Plus size={16} />
        </Button>
      </HeaderRight>
    </Header>
  );
}

function FlowsheetsTable() {
  const { data: flowsheets } = useSuspenseQuery(FlowsheetListQuery);

  const { accessor } = createColumnHelper<Flowsheet>();
  const columns = React.useMemo(
    () => [
      accessor('program', {
        header: 'Program',
      }),
      accessor('track', {
        header: 'Track',
      }),
    ],
    []
  );

  const table = useReactTable({ data: flowsheets, columns, getCoreRowModel: getCoreRowModel() });

  return <DataTable table={table} />;
}

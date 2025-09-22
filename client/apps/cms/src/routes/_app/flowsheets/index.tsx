import { createFileRoute } from '@tanstack/react-router';
import {
  Breadcrumb,
  Breadcrumbs,
  Header,
  HeaderLeft,
  HeaderRight,
} from '@/shared/components/header.tsx';
import { Layers2, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button.tsx';
import { FlowsheetTable } from '@/features/flowsheet/components/flowsheet-table.tsx';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';
import { programQueries } from '@/features/program/queries.ts';

export const Route = createFileRoute('/_app/flowsheets/')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(flowsheetQueries.list);
    queryClient.ensureQueryData(programQueries.list);
  },
  component: () => (
    <div>
      <Header>
        <HeaderLeft>
          <Breadcrumbs>
            <Breadcrumb base>
              <Layers2 size={14} /> Flowsheets
            </Breadcrumb>
          </Breadcrumbs>
        </HeaderLeft>

        <HeaderRight>
          <Button variant="transparent">
            <Plus size={16} /> Add flowsheet
          </Button>
        </HeaderRight>
      </Header>

      <FlowsheetTable />
    </div>
  ),
});

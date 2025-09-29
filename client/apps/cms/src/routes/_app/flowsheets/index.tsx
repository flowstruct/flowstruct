import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header.tsx';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button.tsx';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';
import { programQueries } from '@/features/program/queries.ts';
import { DataTable } from '@/shared/components/data-table/data-table.tsx';
import { useFlowsheetTable } from '@/features/flowsheet/hooks/use-flowsheet-table.ts';
import { DataTableToolbar } from '@/shared/components/data-table/data-table-toolbar.tsx';
import { Tabs } from '@/shared/components/ui/tabs.tsx';
import { getFlowsheetTabs } from '@/features/flowsheet/domain/getFlowsheetTabs.tsx';
import { FlowsheetTabs } from '@/features/flowsheet/domain/flowsheet.ts';

type FlowsheetSearch = {
  tab: FlowsheetTabs;
};

export const Route = createFileRoute('/_app/flowsheets/')({
  validateSearch: (search): FlowsheetSearch => ({
    tab: (search.tab as FlowsheetTabs) || 'active',
  }),
  loaderDeps: ({ search: { tab } }) => ({ tab }),
  loader: async ({ context: { queryClient }, deps: { tab } }) => {
    queryClient.ensureQueryData(programQueries.collection);
    const flowsheets = await queryClient.ensureQueryData(flowsheetQueries.collection);

    switch (tab) {
      case 'active':
        return { flowsheets: flowsheets.filter((f) => f.archivedAt !== undefined) };
      case 'archived':
        return { flowsheets: flowsheets.filter((f) => f.archivedAt === undefined) };
      default:
        return { flowsheets };
    }
  },
  search: {
    middlewares: [stripSearchParams({ tab: 'active' })],
  },
  component: () => {
    const { flowsheets } = Route.useLoaderData();
    const { tab } = Route.useSearch();
    const table = useFlowsheetTable({ flowsheets });
    const navigate = useNavigate();

    return (
      <>
        <Header>
          <HeaderMain>
            <Tabs
              tabs={getFlowsheetTabs()}
              currentTab={tab}
              onTabChange={(next) => navigate({ to: '.', search: { tab: next } })}
            />
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

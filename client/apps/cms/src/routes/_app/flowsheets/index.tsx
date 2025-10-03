import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header.tsx';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';
import { programQueries } from '@/features/program/queries.ts';
import { DataTable } from '@/shared/components/data-table/data-table.tsx';
import { useFlowsheetTable } from '@/features/flowsheet/hooks/use-flowsheet-table.ts';
import { DataTableToolbar } from '@/shared/components/data-table/data-table-toolbar.tsx';
import { Tabs } from '@/shared/components/ui/tabs.tsx';
import { getFlowsheetTabs } from '@/features/flowsheet/domain/getFlowsheetTabs.tsx';
import { ArchiveStatus } from '@/features/flowsheet/domain/flowsheet.ts';
import { CreateFlowsheetModal } from '@/features/flowsheet/components/create-flowsheet-modal.tsx';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getFlowsheetsByArchiveStatus } from '@/features/flowsheet/domain/getFlowsheetsByArchiveStatus.ts';

type FlowsheetSearch = {
  tab: ArchiveStatus;
};

export const Route = createFileRoute('/_app/flowsheets/')({
  validateSearch: (search): FlowsheetSearch => ({
    tab: (search.tab as ArchiveStatus) || 'active',
  }),
  loaderDeps: ({ search: { tab } }) => ({ tab }),
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(programQueries.collection);
    queryClient.ensureQueryData(flowsheetQueries.collection);
  },
  search: {
    middlewares: [stripSearchParams({ tab: 'active' })],
  },
  component: () => {
    const { tab } = Route.useSearch();
    const { data: flowsheets } = useSuspenseQuery({
      ...flowsheetQueries.collection,
      select: (data) => getFlowsheetsByArchiveStatus(data, tab),
    });

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
            <CreateFlowsheetModal />
          </HeaderActions>
        </Header>

        <DataTable table={table} />
      </>
    );
  },
});

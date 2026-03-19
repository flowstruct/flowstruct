import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header';
import { flowsheetQueries } from '@/features/flowsheet/queries';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useFlowsheetTable } from '@/features/flowsheet/hooks/use-flowsheet-table';
import { DataTableToolbar } from '@/shared/components/data-table/data-table-toolbar';
import { Tabs } from '@/shared/components/ui/tabs';
import { ArchiveStatus } from '@/features/flowsheet/domain/flowsheet';
import { CreateFlowsheetModal } from '@/features/flowsheet/components/create-flowsheet-modal/create-flowsheet-modal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getFlowsheetsByArchiveStatus } from '@/features/flowsheet/domain/getFlowsheetsByArchiveStatus';
import { TabOption } from '@/shared/types';
import { CircleDashed, CircleDot, Layers2 } from 'lucide-react';

type FlowsheetSearch = {
  tab: ArchiveStatus;
};

export const Route = createFileRoute('/_app/flowsheets/')({
  validateSearch: (search): FlowsheetSearch => ({
    tab: (search.tab as ArchiveStatus) || 'active',
  }),
  loader: async ({ context: { queryClient } }) => {
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

    return (
      <>
        <Header>
          <HeaderMain>
            <RouteTabs />
          </HeaderMain>

          <HeaderActions>
            <DataTableToolbar enableSearch table={table} />
            <CreateFlowsheetModal />
          </HeaderActions>
        </Header>

        <DataTable table={table} />
      </>
    );
  },
});

function RouteTabs() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  const tabs: TabOption<ArchiveStatus>[] = [
    { value: 'all', label: 'All flowsheets', icon: <Layers2 size={14} /> },
    { value: 'active', label: 'Active', icon: <CircleDot size={14} /> },
    { value: 'archived', label: 'Archived', icon: <CircleDashed size={14} /> },
  ];

  return (
    <Tabs
      tabs={tabs}
      currentTab={tab}
      onTabChange={(next) => navigate({ to: '.', search: { tab: next } })}
    />
  );
}

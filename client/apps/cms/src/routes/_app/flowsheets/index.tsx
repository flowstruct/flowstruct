import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header';
import { flowsheetQueries } from '@/features/flowsheet/queries';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useFlowsheetTable } from '@/features/flowsheet/hooks/use-flowsheet-table';
import { DataTableToolbar } from '@/shared/components/data-table/data-table-toolbar';
import { Tabs } from '@/shared/components/ui/tabs';
import { ArchiveStatus } from '@/features/flowsheet/domain/flowsheet';
import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { getFlowsheetsByArchiveStatus } from '@/features/flowsheet/domain/getFlowsheetsByArchiveStatus';
import { TabOption } from '@/shared/types';
import { CircleDashed, CircleDot, Grid2X2, Layers2, Plus, SquarePlus } from 'lucide-react';
import { Scrollable } from '@/shared/components/scrollable';
import { FlowsheetFormFields } from '@/features/flowsheet/components/flowsheet-form-fields';
import {
  FormModal,
  FormModalBody,
  FormModalContent,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
  FormModalTrigger,
} from '@/shared/components/form-modal';
import { Button } from '@/shared/components/ui/Button';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { Switch } from '@/shared/components/ui/Switch';
import { flowsheetApi } from '@/features/flowsheet/api';
import { Flowsheet } from '@/features/flowsheet/domain/flowsheet';
import { useDisclosure } from '@/shared/hooks/use-disclosure';
import React from 'react';

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

        <Scrollable>
          <DataTable table={table} />
        </Scrollable>
      </>
    );
  },
});

function CreateFlowsheetModal() {
  const programFormState = useDisclosure();
  const [navigateAfter, setNavigateAfter] = React.useState(true);
  const navigate = useNavigate();

  const createFlowsheet = useMutation({
    mutationFn: flowsheetApi.createFlowsheet,
    meta: { successMessage: 'Flowsheet created.' },
  });

  return (
    <FormModal
      size="md"
      onSubmit={(data) => {
        if (programFormState.isOpen) return;
        return createFlowsheet.mutate(data as Partial<Flowsheet>, {
          onSuccess: (result: Flowsheet) => {
            if (navigateAfter) {
              navigate({
                to: '/flowsheets/$flowsheetId',
                params: { flowsheetId: String(result.id) },
              });
            }
          },
        });
      }}
    >
      <FormModalTrigger>
        <Button size="sm" variant="transparent">
          <Plus size={15} />
        </Button>
      </FormModalTrigger>

      <FormModalBody>
        <FormModalHeader>
          <Breadcrumbs>
            <Breadcrumb base>
              <Layers2 size={15} /> Flowsheets
            </Breadcrumb>

            <Breadcrumb>
              <SquarePlus size={15} color="teal" /> New flowsheet
            </Breadcrumb>
          </Breadcrumbs>
        </FormModalHeader>

        <FormModalContent>
          <FlowsheetFormFields programFormState={programFormState} />
        </FormModalContent>

        <FormModalFooter>
          <Switch isSelected={navigateAfter} onChange={setNavigateAfter}>
            Open after creating
          </Switch>

          <FormModalSubmit isPending={createFlowsheet.isPending}>
            <Grid2X2 size={15} /> Create
          </FormModalSubmit>
        </FormModalFooter>
      </FormModalBody>
    </FormModal>
  );
}

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

import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header';
import { programQueries } from '@/features/program/queries';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useProgramTable } from '@/features/program/hooks/use-program-table';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProgramsByStatus, ProgramStatus } from '@/features/program/domain/getProgramsByStatus';
import { TabOption } from '@/shared/types';
import {
  CircleDashed,
  CircleDot,
  Folder,
  GraduationCap,
  Layers2,
  Plus,
  PlusSquare,
} from 'lucide-react';
import { ProgramFormFields } from '@/features/program/components/program-form-fields';
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
import { programApi } from '@/features/program/api';
import { Program } from '@/features/program/domain/program';
import { programKeys } from '@/features/program/queries';
import { Scrollable } from '@/shared/components/scrollable';
import { Title } from '@/shared/components/title';

const tabs: TabOption<ProgramStatus>[] = [
  { value: 'all', label: 'All programs', icon: <Layers2 size={14} /> },
  { value: 'active', label: 'Active', icon: <CircleDot size={14} /> },
  { value: 'outdated', label: 'Outdated', icon: <CircleDashed size={14} /> },
];

type ProgramsSearch = {
  tab: ProgramStatus;
};

export const Route = createFileRoute('/_app/programs/')({
  validateSearch: (search): ProgramsSearch => ({
    tab: (search.tab as ProgramStatus) || 'active',
  }),
  search: {
    middlewares: [stripSearchParams({ tab: 'active' })],
  },
  component: ProgramsPage,
});

function ProgramsPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const { data: programs } = useSuspenseQuery({
    ...programQueries.collection,
    select: (data) => getProgramsByStatus(data, tab),
  });

  const table = useProgramTable({ programs });

  return (
    <>
      <Header>
        <HeaderMain>
          <Title>Programs</Title>
        </HeaderMain>

        <HeaderActions>
          <CreateProgramModal />
        </HeaderActions>
      </Header>

      <Scrollable>
        <DataTable
          table={table}
          tabs={tabs}
          currentTab={tab}
          onTabChange={(next) => navigate({ to: '.', search: { tab: next } })}
        />
      </Scrollable>
    </>
  );
}

function CreateProgramModal() {
  const queryClient = useQueryClient();
  const createProgram = useMutation({
    mutationFn: programApi.createProgram,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programKeys.list() }),
    meta: { successMessage: 'Program created.' },
  });

  return (
    <FormModal size="md" onSubmit={(data) => createProgram.mutate(data as Partial<Program>)}>
      <FormModalTrigger>
        <Button size="sm" variant="transparent">
          <Plus size={15} />
        </Button>
      </FormModalTrigger>

      <FormModalBody>
        <FormModalHeader>
          <Breadcrumbs>
            <Breadcrumb base>
              <Folder size={15} /> Programs
            </Breadcrumb>

            <Breadcrumb>
              <PlusSquare size={15} color="teal" /> New program
            </Breadcrumb>
          </Breadcrumbs>
        </FormModalHeader>

        <FormModalContent>
          <ProgramFormFields />
        </FormModalContent>

        <FormModalFooter>
          <FormModalSubmit isPending={createProgram.isPending}>
            <GraduationCap size={15} /> Create
          </FormModalSubmit>
        </FormModalFooter>
      </FormModalBody>
    </FormModal>
  );
}

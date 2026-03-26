import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header';
import { siteGeneratorQueries } from '@/features/site-generator/queries';
import { siteGeneratorApi } from '@/features/site-generator/api';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useSiteGeneratorTable } from '@/features/site-generator/hooks/use-site-generator-table';
import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import {
  ConfirmationModal,
  ConfirmationModalTrigger,
} from '@/shared/components/confirmation-modal';
import { Button } from '@/shared/components/ui/Button';
import { CurrentGenerationIndicator } from '@/features/site-generator/components/current-generation-indicator';
import { FolderPlus, Plus, Layers2 } from 'lucide-react';
import { Title } from '@/shared/components/title';
import { TabOption } from '@/shared/types';

type SiteGenerationTab = 'all';

const tabs: TabOption<SiteGenerationTab>[] = [
  { value: 'all', label: 'All generations', icon: <Layers2 size={14} /> },
];

function TriggerGenerationButton() {
  const triggerGeneration = useMutation({
    mutationFn: () => siteGeneratorApi.triggerGeneration(),
    meta: { successMessage: 'Site generation started.' },
  });

  return (
    <ConfirmationModal
      header="Generate static site"
      text="This will generate a static site from the current flowsheet data. The process may take a few seconds to complete."
      onConfirm={() => triggerGeneration.mutate()}
      submitLabel="Generate"
      submitIcon={<FolderPlus size={14} />}
    >
      <ConfirmationModalTrigger>
        <Button variant="transparent" size="sm">
          <Plus size={15} />
        </Button>
      </ConfirmationModalTrigger>
    </ConfirmationModal>
  );
}

type SiteGenerationsSearch = {
  tab: SiteGenerationTab;
};

export const Route = createFileRoute('/_app/site-generations/')({
  validateSearch: (search): SiteGenerationsSearch => ({
    tab: (search.tab as SiteGenerationTab) || 'all',
  }),
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(siteGeneratorQueries.collection);
  },
  search: {
    middlewares: [stripSearchParams({ tab: 'all' })],
  },
  component: () => {
    const { tab } = Route.useSearch();
    const navigate = useNavigate();
    const { data: generations } = useSuspenseQuery(siteGeneratorQueries.collection);
    const table = useSiteGeneratorTable({ generations: generations.list });

    return (
      <>
        <Header>
          <HeaderMain>
            <Title>Site generations</Title>
            <CurrentGenerationIndicator />
          </HeaderMain>

          <HeaderActions>
            <TriggerGenerationButton />
          </HeaderActions>
        </Header>

        <DataTable
          table={table}
          tabs={tabs}
          currentTab={tab}
          onTabChange={(next) => navigate({ to: '.', search: { tab: next } })}
        />
      </>
    );
  },
});

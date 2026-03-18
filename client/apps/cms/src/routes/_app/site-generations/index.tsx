import { createFileRoute } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header';
import { siteGeneratorQueries } from '@/features/site-generator/queries';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useSiteGeneratorTable } from '@/features/site-generator/hooks/use-site-generator-table';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TriggerGenerationModal } from '@/features/site-generator/components/trigger-generation-modal';
import { CurrentGenerationIndicator } from '@/features/site-generator/components/current-generation-indicator';
import { FolderClock } from 'lucide-react';

export const Route = createFileRoute('/_app/site-generations/')({
  loader: async ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(siteGeneratorQueries.collection);
  },
  component: () => {
    const { data: generations } = useSuspenseQuery(siteGeneratorQueries.collection);
    const table = useSiteGeneratorTable({ generations: generations.list });

    return (
      <>
        <Header>
          <HeaderMain>
            <h1 className="flex items-center gap-2 text-base font-medium">
              <FolderClock size={18} />
              Site Generations
            </h1>
          </HeaderMain>

          <HeaderActions>
            <CurrentGenerationIndicator />
            <TriggerGenerationModal />
          </HeaderActions>
        </Header>

        <DataTable table={table} />
      </>
    );
  },
});
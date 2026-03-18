import { createFileRoute } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header';
import { siteGeneratorQueries } from '@/features/site-generator/queries';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useSiteGeneratorTable } from '@/features/site-generator/hooks/use-site-generator-table';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TriggerGenerationModal } from '@/features/site-generator/components/trigger-generation-modal';
import { CurrentGenerationIndicator } from '@/features/site-generator/components/current-generation-indicator';
import { FolderUp } from 'lucide-react';
import styles from './index.module.css';
import { DataTableToolbar } from '@/shared/components/data-table/data-table-toolbar';

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
            <p className={styles.header}>
              <FolderUp size={14} />
              Site Generations
            </p>
          </HeaderMain>

          <HeaderActions>
            <CurrentGenerationIndicator />
            <DataTableToolbar table={table} />
            <TriggerGenerationModal />
          </HeaderActions>
        </Header>

        <DataTable table={table} />
      </>
    );
  },
});

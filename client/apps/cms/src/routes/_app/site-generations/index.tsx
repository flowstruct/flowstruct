import { createFileRoute } from '@tanstack/react-router';
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
import { FolderPlus, FolderUp, Plus } from 'lucide-react';
import styles from './index.module.css';
import { DataTableToolbar } from '@/shared/components/data-table/data-table-toolbar';

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
            <TriggerGenerationButton />
          </HeaderActions>
        </Header>

        <DataTable table={table} />
      </>
    );
  },
});

import { FolderClock, Plus, SquarePlus } from 'lucide-react';
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
  FormModalTrigger,
} from '@/shared/components/form-modal';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { Button } from '@/shared/components/ui/Button';
import { siteGeneratorApi } from '@/features/site-generator/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { siteGeneratorKeys } from '@/features/site-generator/queries';
import styles from './trigger-generation-modal.module.css';

export function TriggerGenerationModal() {
  const queryClient = useQueryClient();

  const triggerGeneration = useMutation({
    mutationFn: () => siteGeneratorApi.triggerGeneration(),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    meta: { successMessage: 'Site generation started.' },
  });

  return (
    <FormModal
      onSubmit={async () => {
        const result = await triggerGeneration.mutateAsync();
        return result;
      }}
    >
      <FormModalTrigger>
        <Button variant="transparent" size="sm">
          <Plus size={15} />
        </Button>
      </FormModalTrigger>

      <FormModalBody>
        <FormModalHeader>
          <Breadcrumbs>
            <Breadcrumb base>
              <FolderClock size={15} /> Site Generations
            </Breadcrumb>
            <Breadcrumb>
              <SquarePlus size={15} color="teal" /> Generate static site
            </Breadcrumb>
          </Breadcrumbs>
        </FormModalHeader>

        <p className={styles.confirmText}>
          This will generate a static site from the current flowsheet data. The process may take a
          few seconds to complete.
        </p>
      </FormModalBody>

      <FormModalFooter>
        <FormModalSubmit>
          <SquarePlus size={15} /> Start Generation
        </FormModalSubmit>
      </FormModalFooter>
    </FormModal>
  );
}

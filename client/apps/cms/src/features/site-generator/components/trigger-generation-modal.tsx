import { FolderClock, SquarePlus } from 'lucide-react';
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
      queryClient.invalidateQueries({ queryKey: siteGeneratorKeys.collection() });
      queryClient.invalidateQueries({ queryKey: siteGeneratorKeys.current() });
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
        <Button variant="primary" size="sm">
          <SquarePlus size={14} />
          Generate
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
        <FormModalSubmit isPending={triggerGeneration.isPending}>
          <SquarePlus size={15} /> Start Generation
        </FormModalSubmit>
      </FormModalFooter>
    </FormModal>
  );
}


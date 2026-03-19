import { Plus, SquarePlus } from 'lucide-react';
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
  FormModalTrigger,
} from '@/shared/components/form-modal';
import { Button } from '@/shared/components/ui/Button';
import { siteGeneratorApi } from '@/features/site-generator/api';
import { useMutation } from '@tanstack/react-query';
import styles from './trigger-generation-modal.module.css';

export function TriggerGenerationModal() {
  const triggerGeneration = useMutation({
    mutationFn: () => siteGeneratorApi.triggerGeneration(),
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
        <FormModalHeader>Generate static site</FormModalHeader>

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

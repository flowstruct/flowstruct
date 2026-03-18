import { siteGeneratorApi } from '@/features/site-generator/api';
import { SiteGenerationSummary } from '@/features/site-generator/domain/site-generator';
import { userQueries } from '@/features/user/queries';
import { usePermission } from '@/features/user/hooks/usePermission';
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
} from '@/shared/components/form-modal';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { Button } from '@/shared/components/ui/Button';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu';
import { Popover } from '@/shared/components/ui/Popover';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ellipsis, Download, Trash2, RotateCcw, User, FolderClock } from 'lucide-react';
import React from 'react';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';
import styles from './site-generator-actions-menu.module.css';
import { siteGeneratorKeys } from '@/features/site-generator/queries';

type SiteGeneratorActionsMenuProps = {
  generation: SiteGenerationSummary;
};

export function SiteGeneratorActionsMenu({ generation }: SiteGeneratorActionsMenuProps) {
  const { data: users } = useSuspenseQuery(userQueries.collection);
  const createdBy = generation.createdBy ? users.map[generation.createdBy] : null;
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [confirmRetryOpen, setConfirmRetryOpen] = React.useState(false);

  const canManage = typeof hasPermission === 'function' && hasPermission('site-generator:manage');

  const deleteGeneration = useMutation({
    mutationFn: () => siteGeneratorApi.deleteGeneration(generation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteGeneratorKeys.collection() });
      queryClient.invalidateQueries({ queryKey: siteGeneratorKeys.current() });
    },
    meta: { successMessage: 'Generation deleted.' },
  });

  const retryGeneration = useMutation({
    mutationFn: () => siteGeneratorApi.retryGeneration(generation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteGeneratorKeys.collection() });
      queryClient.invalidateQueries({ queryKey: siteGeneratorKeys.current() });
    },
    meta: { successMessage: 'Generation retry started.' },
  });

  const downloadGeneration = useMutation({
    mutationFn: async () => {
      const blob = await siteGeneratorApi.downloadGeneration(generation.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site-generation-${generation.id}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });

  return (
    <>
      <FormModal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onSubmit={async () => {
          await deleteGeneration.mutateAsync();
          return { id: generation.id };
        }}
        size="sm"
      >
        <FormModalBody>
          <FormModalHeader>
            <Breadcrumbs>
              <Breadcrumb base>
                <FolderClock size={15} /> Site Generations
              </Breadcrumb>
              <Breadcrumb>Delete generation</Breadcrumb>
            </Breadcrumbs>
          </FormModalHeader>
          <p className={styles.confirmText}>
            Are you sure you want to delete this generation? This action cannot be undone.
          </p>
        </FormModalBody>
        <FormModalFooter>
          <FormModalSubmit isPending={deleteGeneration.isPending}>
            <Trash2 size={15} /> Delete
          </FormModalSubmit>
        </FormModalFooter>
      </FormModal>

      <FormModal
        open={confirmRetryOpen}
        onOpenChange={setConfirmRetryOpen}
        onSubmit={async () => {
          await retryGeneration.mutateAsync();
          return { id: generation.id };
        }}
        size="sm"
      >
        <FormModalBody>
          <FormModalHeader>
            <Breadcrumbs>
              <Breadcrumb base>
                <FolderClock size={15} /> Site Generations
              </Breadcrumb>
              <Breadcrumb>Retry generation</Breadcrumb>
            </Breadcrumbs>
          </FormModalHeader>
          <p className={styles.confirmText}>
            This will create a new generation. The failed generation will be kept as history.
          </p>
        </FormModalBody>
        <FormModalFooter>
          <FormModalSubmit isPending={retryGeneration.isPending}>
            <RotateCcw size={15} /> Retry
          </FormModalSubmit>
        </FormModalFooter>
      </FormModal>

      <MenuTrigger>
        <Button shape="icon" variant="ghost" isPending={downloadGeneration.isPending}>
          <Ellipsis size={15} />
        </Button>

        <Popover hideArrow placement="bottom right" crossOffset={25}>
          <Menu width={200}>
            {generation.status === 'COMPLETED' && (
              <MenuItem onAction={() => downloadGeneration.mutate()}>
                <Download size={14} /> Download
              </MenuItem>
            )}

            {generation.status === 'FAILED' && canManage && (
              <MenuItem onAction={() => setConfirmRetryOpen(true)}>
                <RotateCcw size={14} /> Retry
              </MenuItem>
            )}

            {canManage && (
              <MenuItem onAction={() => setConfirmDeleteOpen(true)}>
                <Trash2 size={14} /> Delete
              </MenuItem>
            )}
          </Menu>

          <section className={styles.userActivity}>
            <p>Created {formatTimeAgo(new Date(generation.createdAt))}</p>
            <div className={styles.userActivityUser}>
              <User size={12} />
              <p>{createdBy?.username ?? 'Unknown user'}</p>
            </div>
          </section>

          {generation.status !== 'COMPLETED' && (
            <section className={styles.statusSection} data-status={generation.status}>
              <p>{generation.status}</p>
            </section>
          )}
        </Popover>
      </MenuTrigger>
    </>
  );
}

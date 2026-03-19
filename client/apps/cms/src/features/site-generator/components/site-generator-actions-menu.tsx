import { siteGeneratorApi } from '@/features/site-generator/api';
import { SiteGenerationSummary } from '@/features/site-generator/domain/site-generator';
import { userQueries } from '@/features/user/queries';
import { usePermission } from '@/features/user/hooks/usePermission';
import { ConfirmationModal } from '@/shared/components/confirmation-modal';
import { Button } from '@/shared/components/ui/Button';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu';
import { Popover } from '@/shared/components/ui/Popover';
import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { Ellipsis, Download, Trash2, RotateCcw, User } from 'lucide-react';
import React from 'react';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';
import styles from './site-generator-actions-menu.module.css';

type SiteGeneratorActionsMenuProps = {
  generation: SiteGenerationSummary;
};

export function SiteGeneratorActionsMenu({ generation }: SiteGeneratorActionsMenuProps) {
  const { data: users } = useSuspenseQuery(userQueries.collection);
  const createdBy = generation.createdBy ? users.map[generation.createdBy] : null;
  const { hasPermission } = usePermission();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

  const canManage = typeof hasPermission === 'function' && hasPermission('site-generator:manage');

  const deleteGeneration = useMutation({
    mutationFn: () => siteGeneratorApi.deleteGeneration(generation.id),
    meta: { successMessage: 'Generation deleted.' },
  });

  const retry = useMutation({
    mutationFn: () => siteGeneratorApi.retryGeneration(generation.id),
    meta: { successMessage: 'Generation retry started.' },
  });

  const downloadGeneration = useMutation({
    mutationFn: handleDownload,
  });

  const isPending = deleteGeneration.isPending || retry.isPending;

  return (
    <>
      <ConfirmationModal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        header="Delete generation"
        text="Are you sure you want to delete this generation? This action cannot be undone."
        submitLabel="Delete"
        onConfirm={() => deleteGeneration.mutate()}
      />

      <MenuTrigger>
        <Button shape="icon" variant="ghost" isPending={isPending || downloadGeneration.isPending}>
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
              <MenuItem onAction={() => retry.mutate()}>
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

  async function handleDownload() {
    const blob = await siteGeneratorApi.downloadGeneration(generation.id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-generation-${generation.id}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

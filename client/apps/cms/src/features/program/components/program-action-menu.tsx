import { programApi } from '@/features/program/api';
import { Program } from '@/features/program/domain/program';
import { usePermission } from '@/features/user/hooks/usePermission';
import { userQueries } from '@/features/user/queries';
import {
  FormModal,
  FormModalBody,
  FormModalContent,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
} from '@/shared/components/form-modal';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { Button } from '@/shared/components/ui/Button';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu';
import { Popover } from '@/shared/components/ui/Popover';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Ellipsis, Pencil, Archive, ArchiveRestore, User, Folder, Save } from 'lucide-react';
import React from 'react';
import { ProgramFormFields } from './program-form-fields';
import { programKeys } from '@/features/program/queries';
import styles from './program-action-menu.module.css';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';

type ProgramActionsMenuProps = {
  program: Program;
};

export function ProgramActionsMenu({ program }: ProgramActionsMenuProps) {
  const { data: users } = useSuspenseQuery(userQueries.collection);
  const updatedBy = users.map[program.updatedBy];
  const { hasPermission } = usePermission();
  const isOutdated = program.outdatedAt != null;

  const [editOpen, setEditOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const editProgram = useMutation({
    mutationFn: (data: Partial<Program>) => programApi.editProgram(program.id, data),
    meta: { successMessage: 'Program updated.' },
  });

  const markOutdated = useMutation({
    mutationFn: () => programApi.markOutdated(program.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programKeys.list() }),
    meta: { successMessage: 'Program marked as outdated.' },
  });

  const markActive = useMutation({
    mutationFn: () => programApi.markActive(program.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: programKeys.list() }),
    meta: { successMessage: 'Program marked as active.' },
  });

  const isPending = markOutdated.isPending || markActive.isPending;

  return (
    <>
      <FormModal
        size="md"
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={(data) => editProgram.mutate(data as Partial<Program>)}
      >
        <FormModalBody>
          <FormModalHeader>
            <Breadcrumbs>
              <Breadcrumb base>
                <Folder size={15} /> Programs
              </Breadcrumb>

              <Breadcrumb>
                <Pencil size={15} color="teal" /> Edit program
              </Breadcrumb>
            </Breadcrumbs>
          </FormModalHeader>

          <FormModalContent>
            <ProgramFormFields
              defaultValues={{
                code: program.code,
                name: program.name,
                degree: program.degree,
              }}
            />
          </FormModalContent>

          <FormModalFooter>
            <FormModalSubmit isPending={editProgram.isPending}>
              <Save size={15} /> Save
            </FormModalSubmit>
          </FormModalFooter>
        </FormModalBody>
      </FormModal>

      <MenuTrigger>
        <Button shape="icon" variant="ghost" isPending={isPending}>
          <Ellipsis size={15} />
        </Button>

        <Popover hideArrow placement="bottom right" crossOffset={25}>
          <Menu width={200}>
            <MenuItem onAction={() => setEditOpen(true)}>
              <Pencil size={14} /> Edit
            </MenuItem>

            {typeof hasPermission === 'function' &&
              hasPermission('study-plans:archive') &&
              (isOutdated ? (
                <MenuItem onAction={() => markActive.mutate()}>
                  <ArchiveRestore size={14} /> Mark active
                </MenuItem>
              ) : (
                <MenuItem onAction={() => markOutdated.mutate()}>
                  <Archive size={14} /> Mark outdated
                </MenuItem>
              ))}
          </Menu>

          <section className={styles.userActivity}>
            <p>Edited {formatTimeAgo(new Date(program.updatedAt))}</p>
            <div className={styles.userActivityUser}>
              <User size={12} />
              <p>{updatedBy?.username ?? 'Unknown user'}</p>
            </div>
          </section>

          {isOutdated && (
            <section className={styles.statusSection} data-outdated>
              <p>OUTDATED</p>
            </section>
          )}
        </Popover>
      </MenuTrigger>
    </>
  );
}

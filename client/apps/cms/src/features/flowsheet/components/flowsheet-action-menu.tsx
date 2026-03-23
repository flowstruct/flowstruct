import { flowsheetApi } from '@/features/flowsheet/api';
import { FlowsheetFormFields } from '@/features/flowsheet/components/flowsheet-form-fields';
import { Flowsheet, FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet';
import { usePermission } from '@/features/user/hooks/usePermission';
import { userQueries } from '@/features/user/queries';
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
import { Switch } from '@/shared/components/ui/Switch';
import { useDisclosure } from '@/shared/hooks/use-disclosure';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  Layers2,
  Grid2X2,
  SquarePlus,
  Ellipsis,
  ArchiveRestore,
  Archive,
  User,
  CircleCheck,
  CircleX,
  Pencil,
} from 'lucide-react';
import React from 'react';
import styles from './flowsheet-action-menu.module.css';

type ActionsMenuProps = {
  flowsheet: FlowsheetSummary;
};

export function FlowsheetActionsMenu({ flowsheet }: ActionsMenuProps) {
  const { data: users } = useSuspenseQuery(userQueries.collection);
  const editedBy = users.map[flowsheet.updatedBy];
  const { hasPermission } = usePermission();
  const isArchived = flowsheet.archivedAt != null;

  const [navigateAfter, setNavigateAfter] = React.useState(true);
  const [cloneOpen, setCloneOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const navigate = useNavigate();

  const programFormState = useDisclosure();
  const editProgramFormState = useDisclosure();

  const cloneFlowsheet = useMutation({
    mutationFn: (data: Partial<Flowsheet>) =>
      flowsheetApi.cloneFlowsheet({ flowsheetId: flowsheet.id, details: data }),
    meta: { successMessage: 'Flowsheet cloned.' },
  });

  const editFlowsheet = useMutation({
    mutationFn: (data: Partial<Flowsheet>) => flowsheetApi.editFlowsheetDetails(flowsheet.id, data),
    meta: { successMessage: 'Flowsheet updated.' },
  });

  const archive = useMutation({
    mutationFn: () => flowsheetApi.archiveFlowsheet(flowsheet.id),
    meta: { successMessage: 'Flowsheet archived.' },
  });

  const unarchive = useMutation({
    mutationFn: () => flowsheetApi.unarchiveFlowsheet(flowsheet.id),
    meta: { successMessage: 'Flowsheet unarchived.' },
  });

  const approveChanges = useMutation({
    mutationFn: () => flowsheetApi.approveChanges(flowsheet.id),
    meta: { successMessage: 'Changes approved.' },
  });

  const discardChanges = useMutation({
    mutationFn: () => flowsheetApi.discardChanges(flowsheet.id),
    meta: { successMessage: 'Changes discarded.' },
  });

  const isPending =
    archive.isPending ||
    unarchive.isPending ||
    approveChanges.isPending ||
    discardChanges.isPending ||
    editFlowsheet.isPending;

  const canApprove =
    typeof hasPermission === 'function' &&
    hasPermission('study-plans:approve') &&
    flowsheet.status !== 'APPROVED';

  const canEdit = typeof hasPermission === 'function' && hasPermission('study-plans:edit');

  return (
    <>
      <FormModal
        size="md"
        open={cloneOpen}
        onOpenChange={setCloneOpen}
        onSubmit={(data) => {
          if (programFormState.isOpen) return;

          cloneFlowsheet.mutate(data as Partial<Flowsheet>, {
            onSuccess: (result: Flowsheet) => {
              if (navigateAfter) {
                navigate({
                  to: '/flowsheets/$flowsheetId',
                  params: { flowsheetId: String(result.id) },
                });
              }
            },
          });
        }}
      >
        <FormModalBody>
          <FormModalHeader>
            <Breadcrumbs>
              <Breadcrumb base>
                <Layers2 size={15} /> Flowsheets
              </Breadcrumb>

              <Breadcrumb>
                <Grid2X2 size={15} color="teal" /> Clone flowsheet
              </Breadcrumb>
            </Breadcrumbs>
          </FormModalHeader>

          <FlowsheetFormFields
            disableProgram
            programFormState={programFormState}
            defaultValues={{
              program: flowsheet.program,
              year: flowsheet.year,
              name: flowsheet.name,
            }}
          />

          <FormModalFooter>
            <Switch isSelected={navigateAfter} onChange={setNavigateAfter}>
              Open after creating
            </Switch>

            <FormModalSubmit isPending={cloneFlowsheet.isPending}>
              <SquarePlus size={15} /> Clone
            </FormModalSubmit>
          </FormModalFooter>
        </FormModalBody>
      </FormModal>

      <FormModal
        size="md"
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={(data) => {
          if (editProgramFormState.isOpen) return;

          editFlowsheet.mutate(data as Partial<Flowsheet>);
        }}
      >
        <FormModalBody>
          <FormModalHeader>
            <Breadcrumbs>
              <Breadcrumb base>
                <Layers2 size={15} /> Flowsheets
              </Breadcrumb>

              <Breadcrumb>
                <Pencil size={15} color="teal" /> Edit flowsheet
              </Breadcrumb>
            </Breadcrumbs>
          </FormModalHeader>

          <FlowsheetFormFields
            disableProgram
            programFormState={editProgramFormState}
            defaultValues={{
              program: flowsheet.program,
              year: flowsheet.year,
              name: flowsheet.name,
            }}
          />

          <FormModalFooter>
            <FormModalSubmit isPending={editFlowsheet.isPending}>
              <Pencil size={15} /> Save
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
            {canEdit && (
              <MenuItem onAction={() => setEditOpen(true)}>
                <Pencil size={14} /> Edit
              </MenuItem>
            )}

            <MenuItem onAction={() => setCloneOpen(true)}>
              <SquarePlus size={14} /> Clone
            </MenuItem>

            {canApprove && (
              <MenuItem onAction={() => approveChanges.mutate()}>
                <CircleCheck size={14} /> Approve changes
              </MenuItem>
            )}

            {canApprove && flowsheet.status !== 'NEW' && (
              <MenuItem onAction={() => discardChanges.mutate()}>
                <CircleX size={14} /> Discard changes
              </MenuItem>
            )}

            {typeof hasPermission === 'function' &&
              hasPermission('study-plans:archive') &&
              (isArchived ? (
                <MenuItem onAction={() => unarchive.mutate()}>
                  <ArchiveRestore size={14} /> Unarchive
                </MenuItem>
              ) : (
                <MenuItem onAction={() => archive.mutate()}>
                  <Archive size={14} /> Archive
                </MenuItem>
              ))}
          </Menu>

          <section className={styles.userActivity}>
            <p>Edited {formatTimeAgo(new Date(flowsheet.updatedAt))}</p>
            <div className={styles.userActivityUser}>
              <User size={12} />
              <p>{editedBy?.username ?? 'Unknown user'}</p>
            </div>
          </section>

          {flowsheet.status !== 'APPROVED' && (
            <section className={styles.statusSection} data-status={flowsheet.status || undefined}>
              <p>{flowsheet.status}</p>
            </section>
          )}
        </Popover>
      </MenuTrigger>
    </>
  );
}

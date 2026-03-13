import {
  createColumnHelper,
  FilterFn,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import { Flowsheet, FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet';
import React from 'react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName';
import { setIncludes } from '@/shared/utils/setIncludes';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  Archive,
  ArchiveRestore,
  Ellipsis,
  Grid2X2,
  Layers2,
  SquarePlus,
  User,
} from 'lucide-react';
import styles from './use-flowsheet-table.module.css';
import { useNavigate } from '@tanstack/react-router';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu';
import { Button } from '@/shared/components/ui/Button';
import { Popover } from '@/shared/components/ui/Popover';
import { userQueries } from '@/features/user/queries';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';
import { FlowsheetStatusIcon } from '@/features/flowsheet/components/flowsheet-status-icon';
import { flowsheetApi } from '@/features/flowsheet/api';
import { usePermission } from '@/features/user/hooks/usePermission';
import { useDisclosure } from '@/shared/hooks/use-disclosure';
import {
  FormModal,
  FormModalBody,
  FormModalContent,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
  useFormModalContext,
} from '@/shared/components/form-modal';
import {
  FlowsheetFormFields,
  NavigateToFlowsheetSwitch,
} from '@/features/flowsheet/components/create-flowsheet-modal/create-flowsheet-modal';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';

interface UseFlowsheetTableProps {
  flowsheets: FlowsheetSummary[];
}

export const useFlowsheetTable = ({ flowsheets }: UseFlowsheetTableProps) => {
  const { data: programs } = useSuspenseQuery(programQueries.collection);
  const navigate = useNavigate();

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    let rowValue = row.getValue(columnId);

    if (columnId === 'program') {
      const program = programs.byIds[rowValue as number];
      rowValue = program ? getProgramDisplayName(program) : '';
    }

    const itemRank = rankItem(rowValue, value);
    addMeta({ itemRank });

    return itemRank.passed;
  };

  const { accessor, display } = createColumnHelper<FlowsheetSummary>();
  const columns = React.useMemo(
    () => [
      accessor('program', {
        header: 'Program',
        cell: ({ row }) => {
          const program = programs.byIds[row.original.program];
          const programName = program ? getProgramDisplayName(program) : 'None';

          return (
            <div className={styles.programCell}>
              <FlowsheetStatusIcon flowsheet={row.original} />
              <p>{programName}</p>
            </div>
          );
        },
        filterFn: setIncludes,
        meta: {
          renderFilterName: (value: number) => {
            const flowsheetProgram = programs.byIds[value];
            return flowsheetProgram ? getProgramDisplayName(flowsheetProgram) : 'None';
          },
          renderColumnDisplayName: () => 'Program',
        },
        sortingFn: (rowA, rowB) => {
          const programA = programs.byIds[rowA.original.program];
          const programB = programs.byIds[rowB.original.program];

          if (!programA || !programB) return 0;

          return programA.name.localeCompare(programB.name);
        },
      }),

      accessor('year', {
        header: 'Year',
        cell: ({ cell }) => (
          <p className={styles.yearCell}>
            {cell.getValue()} - {cell.getValue() + 1}
          </p>
        ),
        meta: {
          renderFilterName: (value: number) => `${value} - ${value + 1}`,
          renderColumnDisplayName: () => 'Year',
        },
        filterFn: setIncludes,
        sortingFn: (rowA, rowB) => rowA.original.year - rowB.original.year,
      }),

      accessor('name', {
        header: 'Name',
        cell: ({ cell }) =>
          cell.getValue().length === 0 ? <p className={styles.emptyTrack}>---</p> : cell.getValue(),
        enableColumnFilter: false,
        enableSorting: false,
        meta: {
          renderColumnDisplayName: () => 'Name',
        },
      }),
      display({
        id: 'actions',
        cell: ({ row }) => (
          <div className={styles.actionsMenu}>
            <ActionsMenu flowsheet={row.original} />
          </div>
        ),
        enableHiding: false,
        size: 50,
      }),
    ],
    [programs.byIds]
  );

  return useReactTable({
    data: flowsheets,
    columns,
    initialState: {
      sorting: [{ id: 'year', desc: true }],
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      rowAction: (row: Row<FlowsheetSummary>) => {
        navigate({
          to: '/flowsheets/$flowsheetId',
          params: { flowsheetId: String(row.original.id) },
        });
      },
    },
  });
};

type ActionsMenuProps = {
  flowsheet: FlowsheetSummary;
};

function ActionsMenu({ flowsheet }: ActionsMenuProps) {
  const { data: users } = useSuspenseQuery(userQueries.collection);
  const editedBy = users.map[flowsheet.updatedBy];
  const programFormState = useDisclosure();
  const { hasPermission } = usePermission();
  const isArchived = flowsheet.archivedAt != null;

  const cloneFlowsheet = useMutation({
    mutationFn: (data: Partial<Flowsheet>) =>
      flowsheetApi.cloneFlowsheet({ flowsheetId: flowsheet.id, details: data }),
    meta: { successMessage: 'Flowsheet cloned.' },
  });

  const archive = useMutation({
    mutationFn: () => flowsheetApi.archiveFlowsheet(flowsheet.id),
    meta: { successMessage: 'Flowsheet archived.' },
  });

  const unarchive = useMutation({
    mutationFn: () => flowsheetApi.unarchiveFlowsheet(flowsheet.id),
    meta: { successMessage: 'Flowsheet unarchived.' },
  });

  const isPending = archive.isPending || unarchive.isPending;

  return (
    <FormModal
      onSubmit={(data) => {
        if (programFormState.isOpen) return;
        return cloneFlowsheet.mutateAsync(data as Partial<Flowsheet>) as Promise<{
          id: number;
        }>;
      }}
      isPending={cloneFlowsheet.isPending}
    >
      <MenuTrigger>
        <Button shape="icon" variant="ghost" isPending={isPending}>
          <Ellipsis size={15} />
        </Button>

        <Popover hideArrow placement="bottom right" crossOffset={25}>
          <Menu width={200}>
            <CloneMenuItem />

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
        </Popover>
      </MenuTrigger>

      <FormModalContent>
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
            programFormState={programFormState}
            defaultValues={{
              program: flowsheet.program,
              year: flowsheet.year,
              name: flowsheet.name,
            }}
          />
        </FormModalBody>

        <FormModalFooter>
          <NavigateToFlowsheetSwitch />
          <FormModalSubmit>
            <SquarePlus size={15} /> Clone flowsheet
          </FormModalSubmit>
        </FormModalFooter>
      </FormModalContent>
    </FormModal>
  );
}

function CloneMenuItem() {
  const { open } = useFormModalContext();

  return (
    <MenuItem onAction={open}>
      <SquarePlus size={14} /> Clone
    </MenuItem>
  );
}

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
import { FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet.ts';
import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries.ts';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import { setIncludes } from '@/shared/utils/setIncludes.ts';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Archive, Ellipsis, Link, User } from 'lucide-react';
import styles from './use-flowsheet-table.module.css';
import { useNavigate } from '@tanstack/react-router';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { userQueries } from '@/features/user/queries.ts';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo.ts';
import { FlowsheetStatusIcon } from '@/features/flowsheet/components/flowsheet-status-icon.tsx';

interface UseFlowsheetTableProps {
  flowsheets: FlowsheetSummary[];
}

export const useFlowsheetTable = ({ flowsheets }: UseFlowsheetTableProps) => {
  const { data: programs } = useSuspenseQuery(programQueries.collection);
  const navigate = useNavigate();

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    let rowValue = row.getValue(columnId);

    if (columnId === 'program') {
      const program = programs.map[rowValue as number];
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
          const program = programs.map[row.original.program];
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
            const flowsheetProgram = programs.map[value];
            return flowsheetProgram ? getProgramDisplayName(flowsheetProgram) : 'None';
          },
          renderColumnDisplayName: () => 'Program',
        },
        sortingFn: (rowA, rowB) => {
          const programA = programs.map[rowA.original.program];
          const programB = programs.map[rowB.original.program];

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
    [programs.map]
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

  return (
    <MenuTrigger>
      <Button size="icon" variant="ghost">
        <Ellipsis size={15} />
      </Button>

      <Popover hideArrow placement="bottom right" crossOffset={25}>
        <Menu>
          <MenuItem>
            <Link size={14} />
            Copy page URL
          </MenuItem>

          <MenuItem>
            <Archive size={14} /> Archive
          </MenuItem>
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
  );
}

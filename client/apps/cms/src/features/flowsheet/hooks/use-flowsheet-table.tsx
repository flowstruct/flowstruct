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
import { FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet';
import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName';
import { setIncludes } from '@/shared/utils/setIncludes';
import { rankItem } from '@tanstack/match-sorter-utils';
import styles from './use-flowsheet-table.module.css';
import { useNavigate } from '@tanstack/react-router';
import { FlowsheetStatusIcon } from '@/features/flowsheet/components/flowsheet-status-icon';
import { ActionsMenu } from '@/features/flowsheet/components/flowsheet-action-menu';

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

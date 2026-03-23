import {
  createColumnHelper,
  FilterFn,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Program } from '@/features/program/domain/program';
import React from 'react';
import { rankItem } from '@tanstack/match-sorter-utils';
import styles from './use-program-table.module.css';
import { ProgramStatusIcon } from '@/features/program/components/program-status-icon';
import { ProgramActionsMenu } from '@/features/program/components/program-action-menu';
import { setIncludes } from '@/shared/utils/setIncludes';

interface UseProgramTableProps {
  programs: Program[];
}

export const useProgramTable = ({ programs }: UseProgramTableProps) => {
  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const { accessor, display } = createColumnHelper<Program>();
  const columns = React.useMemo(
    () => [
      accessor('name', {
        header: 'Program',
        cell: ({ row }) => {
          return (
            <div className={styles.programCell}>
              <ProgramStatusIcon program={row.original} />
              <p>{row.original.name}</p>
            </div>
          );
        },
        filterFn: setIncludes,
        meta: {
          renderFilterName: (value: string) => value,
          renderColumnDisplayName: () => 'Program',
        },
        sortingFn: (rowA, rowB) => rowA.original.name.localeCompare(rowB.original.name),
      }),

      accessor('code', {
        header: 'Code',
        cell: ({ cell }) => cell.getValue(),
        filterFn: setIncludes,
        meta: {
          renderFilterName: (value: string) => value,
          renderColumnDisplayName: () => 'Code',
        },
        sortingFn: (rowA, rowB) => rowA.original.code.localeCompare(rowB.original.code),
      }),

      accessor('degree', {
        header: 'Degree',
        cell: ({ cell }) => cell.getValue(),
        filterFn: setIncludes,
        meta: {
          renderFilterName: (value: string) => value,
          renderColumnDisplayName: () => 'Degree',
        },
        sortingFn: (rowA, rowB) => rowA.original.degree.localeCompare(rowB.original.degree),
      }),

      display({
        id: 'actions',
        cell: ({ row }) => (
          <div className={styles.actionsMenu}>
            <ProgramActionsMenu program={row.original} />
          </div>
        ),
        enableHiding: false,
        size: 50,
      }),
    ],
    []
  );

  return useReactTable({
    data: programs,
    columns,
    initialState: {
      sorting: [{ id: 'name', desc: false }],
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
};


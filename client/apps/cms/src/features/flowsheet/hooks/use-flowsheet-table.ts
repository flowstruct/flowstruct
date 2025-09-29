import {
  createColumnHelper,
  FilterFn,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet.ts';
import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries.ts';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import { setIncludes } from '@/shared/utils/setIncludes.ts';
import { rankItem } from '@tanstack/match-sorter-utils';

interface UseFlowsheetTableProps {
  flowsheets: FlowsheetSummary[];
}

export const useFlowsheetTable = ({ flowsheets }: UseFlowsheetTableProps) => {
  const { data: programs } = useSuspenseQuery(programQueries.collection);

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

  const { accessor } = createColumnHelper<FlowsheetSummary>();
  const columns = React.useMemo(
    () => [
      accessor('program', {
        header: 'Program',
        cell: ({ cell }) => {
          const flowsheetProgram = programs.map[cell.getValue()];
          return flowsheetProgram ? getProgramDisplayName(flowsheetProgram) : 'None';
        },
        filterFn: setIncludes,
        meta: {
          renderFilterName: (value: number) => {
            const flowsheetProgram = programs.map[value];
            return flowsheetProgram ? getProgramDisplayName(flowsheetProgram) : 'None';
          },
          renderSortName: () => 'Program',
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
        cell: ({ cell }) => `${cell.getValue()} - ${cell.getValue() + 1}`,
        meta: {
          renderFilterName: (value: number) => `${value} - ${value + 1}`,
          renderSortName: () => 'Year',
        },
        filterFn: setIncludes,
        sortingFn: (rowA, rowB) => rowA.original.year - rowB.original.year,
      }),
      accessor('track', {
        header: 'Track',
        cell: ({ cell }) => cell.getValue() ?? '---',
        enableColumnFilter: false,
        enableSorting: false,
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
  });
};

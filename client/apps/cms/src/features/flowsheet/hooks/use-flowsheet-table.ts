import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet.ts';
import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { flowsheetQueries } from '@/features/flowsheet/queries.ts';
import { programQueries } from '@/features/program/queries.ts';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import { setIncludes } from '@/shared/utils/setIncludes.ts';

export const useFlowsheetTable = () => {
  const { data: flowsheets } = useSuspenseQuery(flowsheetQueries.list);
  const { data: programs } = useSuspenseQuery(programQueries.collection);

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
          renderFilterItem: (value: number) => {
            const flowsheetProgram = programs.map[value];
            return flowsheetProgram ? getProgramDisplayName(flowsheetProgram) : 'None';
          },
        },
      }),
      accessor('year', {
        header: 'Year',
        cell: ({ cell }) => `${cell.getValue()} - ${cell.getValue() + 1}`,
        meta: {
          renderFilterItem: (value: number) => `${value} - ${value + 1}`,
        },
        filterFn: setIncludes,
      }),
      accessor('track', {
        header: 'Track',
        cell: ({ cell }) => cell.getValue() ?? '---',
        enableColumnFilter: false,
      }),
    ],
    [programs.map]
  );

  return useReactTable({
    data: flowsheets,
    columns,
    initialState: {
      grouping: ['program'],
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
};

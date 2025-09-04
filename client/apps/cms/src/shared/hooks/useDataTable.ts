import React from 'react';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  TableOptions,
  Updater,
  useReactTable,
} from '@tanstack/react-table';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { TableSearchOptions } from '@/shared/types.ts';

type useDataTableProps<TData> = Omit<
  TableOptions<TData>,
  'state' | 'getCoreRowModel' | 'autoResetPageIndex'
> & {
  search: TableSearchOptions;
};

export const useDataTable = <TData>(props: useDataTableProps<TData>) => {
  const location = useLocation();
  const navigate = useNavigate();
  const search = props.search;

  const onGlobalFilterChange = React.useCallback(
    (updaterOrValue: Updater<string>) => {
      const next =
        typeof updaterOrValue === 'function'
          ? (updaterOrValue as (prev: string) => string)(search.filter)
          : updaterOrValue;

      navigate({
        to: location.pathname,
        search: (prev) => ({
          ...prev,
          filter: next,
          page: prev.filter !== next && next !== '' ? 0 : prev.page,
        }),
      });
    },
    [location.pathname, navigate, search.filter]
  );

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      const next =
        typeof updaterOrValue === 'function'
          ? (updaterOrValue as (prev: ColumnFiltersState) => ColumnFiltersState)(
              search.columnFilters
            )
          : updaterOrValue;

      navigate({
        to: location.pathname,
        search: (prev) => ({
          ...prev,
          columnFilters: next,
        }),
      });
    },
    [location.pathname, navigate, search.columnFilters]
  );

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const next =
        typeof updaterOrValue === 'function'
          ? (updaterOrValue as (prev: PaginationState) => PaginationState)({
              pageIndex: search.page,
              pageSize: search.size,
            })
          : updaterOrValue;

      navigate({
        to: location.pathname,
        search: (prev) => ({
          ...prev,
          page: next.pageIndex,
          size: next.pageSize,
        }),
        resetScroll: false,
      });
    },
    [location.pathname, navigate, search.page, search.size]
  );

  return useReactTable({
    ...props,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: search.filter,
      columnFilters: search.columnFilters,
      pagination: {
        pageIndex: search.page,
        pageSize: search.size,
      },
    },
    onGlobalFilterChange,
    onColumnFiltersChange,
    onPaginationChange,
    autoResetPageIndex: false,
  });
};

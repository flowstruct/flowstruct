import {
  createColumnHelper,
  FilterFn,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  TableOptions,
  Updater,
  useReactTable,
} from '@tanstack/react-table';
import { CourseSummary, CourseType } from '@/features/course/domain/course';
import React from 'react';
import { rankItem } from '@tanstack/match-sorter-utils';
import styles from './use-course-table.module.css';
import { CourseStatusIcon } from '@/features/course/components/course-status-icon';
import { CourseActionsMenu } from '@/features/course/components/course-action-menu';
import { setIncludes } from '@/shared/utils/setIncludes';
import { SearchOptions } from '@/shared/types';
import { useLocation, useNavigate } from '@tanstack/react-router';

interface UseCourseTableProps {
  courses: CourseSummary[];
  pageCount: number;
  rowCount: number;
  searchOptions: SearchOptions;
}

export const useCourseTable = ({
  courses,
  pageCount,
  rowCount,
  searchOptions,
}: UseCourseTableProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onGlobalFilterChange = React.useCallback(
    (updaterOrValue: Updater<string>) => {
      const next =
        typeof updaterOrValue === 'function'
          ? (updaterOrValue as (prev: string) => string)(searchOptions.filter ?? '')
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
    [location.pathname, navigate, searchOptions.filter]
  );

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const next =
        typeof updaterOrValue === 'function'
          ? (updaterOrValue as (prev: PaginationState) => PaginationState)({
              pageIndex: searchOptions.page ?? 0,
              pageSize: searchOptions.size ?? 20,
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
    [location.pathname, navigate, searchOptions.page, searchOptions.size]
  );

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const { accessor, display } = createColumnHelper<CourseSummary>();
  const columns = React.useMemo(
    () => [
      accessor('name', {
        header: 'Course',
        cell: ({ row }) => {
          return (
            <div className={styles.courseCell}>
              <CourseStatusIcon course={row.original} />
              <p>{row.original.name}</p>
            </div>
          );
        },
        filterFn: setIncludes,
        sortingFn: (rowA, rowB) => rowA.original.name.localeCompare(rowB.original.name),
        enableColumnFilter: false,
        meta: {
          renderColumnDisplayName: () => 'Name',
        },
      }),

      accessor('code', {
        header: 'Code',
        cell: ({ cell }) => cell.getValue(),
        filterFn: setIncludes,
        sortingFn: (rowA, rowB) => rowA.original.code.localeCompare(rowB.original.code),
        enableColumnFilter: false,
        meta: {
          renderColumnDisplayName: () => 'Code',
        },
      }),

      accessor('creditHours', {
        header: 'Credit Hours',
        cell: ({ cell }) => cell.getValue(),
        sortingFn: (rowA, rowB) => rowA.original.creditHours - rowB.original.creditHours,
        enableColumnFilter: false,
        meta: {
          renderColumnDisplayName: () => 'Credit Hours',
        },
      }),

      accessor('type', {
        header: 'Type',
        cell: ({ cell }) => {
          const type = cell.getValue() as keyof typeof CourseType;
          return CourseType[type] || type;
        },
        filterFn: setIncludes,
        sortingFn: (rowA, rowB) => rowA.original.type.localeCompare(rowB.original.type),
        enableColumnFilter: false,
        meta: {
          renderColumnDisplayName: () => 'Type',
        },
      }),

      display({
        id: 'actions',
        cell: ({ row }) => (
          <div className={styles.actionsMenu}>
            <CourseActionsMenu course={row.original} searchOptions={searchOptions} />
          </div>
        ),
        enableHiding: false,
        size: 50,
      }),
    ],
    [searchOptions]
  );

  return useReactTable({
    data: courses,
    columns,
    pageCount,
    rowCount,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: searchOptions.filter ?? '',
      pagination: {
        pageIndex: searchOptions.page ?? 0,
        pageSize: searchOptions.size ?? 20,
      },
    },
    onGlobalFilterChange,
    onPaginationChange,
    manualPagination: true,
    manualFiltering: true,
    autoResetPageIndex: false,
    globalFilterFn: fuzzyFilter,
  });
};

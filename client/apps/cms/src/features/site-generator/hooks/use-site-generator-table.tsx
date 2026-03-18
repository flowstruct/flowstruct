import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { SiteGenerationSummary } from '@/features/site-generator/domain/site-generator';
import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueries } from '@/features/user/queries';
import { SiteGeneratorStatusIcon } from '@/features/site-generator/components/site-generator-status-icon';
import { SiteGeneratorActionsMenu } from '@/features/site-generator/components/site-generator-actions-menu';
import styles from './use-site-generator-table.module.css';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';

interface UseSiteGeneratorTableProps {
  generations: SiteGenerationSummary[];
}

export function useSiteGeneratorTable({ generations }: UseSiteGeneratorTableProps) {
  const { data: users } = useSuspenseQuery(userQueries.collection);

  const { accessor, display } = createColumnHelper<SiteGenerationSummary>();
  const columns = React.useMemo(
    () => [
      accessor('id', {
        header: 'ID',
        cell: ({ cell }) => <p className={styles.idCell}>#{cell.getValue()}</p>,
        enableColumnFilter: false,
        meta: {
          renderColumnDisplayName: () => 'ID',
        },
      }),
      accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className={styles.statusCell}>
            <SiteGeneratorStatusIcon generation={row.original} />
          </div>
        ),
        enableColumnFilter: false,
        enableSorting: false,
        meta: {
          renderColumnDisplayName: () => 'Status',
        },
      }),
      accessor('createdBy', {
        header: 'Created by',
        cell: ({ row }) => {
          const userId = row.original.createdBy;
          if (!userId) {
            return <p className={styles.emptyCell}>---</p>;
          }
          const user = users.map[userId];
          return <p className={styles.userCell}>{user?.username ?? 'Unknown'}</p>;
        },
        enableColumnFilter: false,
        enableSorting: false,
        meta: {
          renderColumnDisplayName: () => 'Created by',
        },
      }),
      accessor('createdAt', {
        header: 'Created at',
        cell: ({ cell }) => {
          const date = new Date(cell.getValue() as string);
          return <p className={styles.dateCell}>{formatTimeAgo(date)}</p>;
        },
        enableColumnFilter: false,
        meta: {
          renderColumnDisplayName: () => 'Created at',
        },
      }),
      accessor('completedAt', {
        header: 'Completed at',
        cell: ({ row }) => {
          const completedAt = row.original.completedAt;
          if (!completedAt) {
            return <p className={styles.emptyCell}>---</p>;
          }
          const date = new Date(completedAt);
          return <p className={styles.dateCell}>{formatTimeAgo(date)}</p>;
        },
        enableColumnFilter: false,
        meta: {
          renderColumnDisplayName: () => 'Completed at',
        },
      }),
      display({
        id: 'actions',
        cell: ({ row }) => (
          <div className={styles.actionsMenu}>
            <SiteGeneratorActionsMenu generation={row.original} />
          </div>
        ),
        enableHiding: false,
        size: 50,
      }),
    ],
    [users.map]
  );

  return useReactTable({
    data: generations,
    columns,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  });
}


import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
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
import { UserIcon } from 'lucide-react';
import { setIncludes } from '@/shared/utils/setIncludes';

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
        cell: ({ row }) => (
          <div className={styles.idCell}>
            <SiteGeneratorStatusIcon generation={row.original} />
            <p>#{row.original.id}</p>
          </div>
        ),
        enableColumnFilter: false,
        meta: {
          renderColumnDisplayName: () => 'ID',
        },
      }),
      accessor('completedAt', {
        header: 'Completed',
        cell: ({ row }) => {
          const completedAt = row.original.completedAt;

          if (!completedAt) {
            return <p className={styles.emptyCell}>---</p>;
          }

          return <p className={styles.dateCell}>{formatTimeAgo(new Date(completedAt))}</p>;
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
      sorting: [{ id: 'id', desc: true }],
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
}

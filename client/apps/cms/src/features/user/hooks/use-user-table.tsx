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
import { User } from '@/features/user/domain/user';
import { Role } from '@/features/user/domain/user';
import React from 'react';
import { rankItem } from '@tanstack/match-sorter-utils';
import styles from './use-user-table.module.css';
import { UserActionMenu } from '@/features/user/components/user-action-menu';
import { Crown, Shield, Edit, Eye } from 'lucide-react';
import { setIncludes } from '@/shared/utils/setIncludes';

type UseUserTableProps = {
  users: User[];
  currentUser: User;
};

const RoleIcons = {
  ADMIN: <Crown size={14} />,
  APPROVER: <Shield size={14} />,
  EDITOR: <Edit size={14} />,
  GUEST: <Eye size={14} />,
};

export const useUserTable = ({ users, currentUser }: UseUserTableProps) => {
  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const { accessor, display } = createColumnHelper<User>();
  const columns = React.useMemo(
    () => [
      accessor('username', {
        header: 'User',
        cell: ({ row }) => {
          const roleIcon = RoleIcons[row.original.role as keyof typeof RoleIcons];
          return (
            <div className={styles.userCell}>
              {roleIcon}
              <p>{row.original.username}</p>
            </div>
          );
        },
        filterFn: setIncludes,
        meta: {
          renderFilterName: (value: string) => value,
          renderColumnDisplayName: () => 'User',
        },
        enableColumnFilter: false,
        sortingFn: (rowA, rowB) => rowA.original.username.localeCompare(rowB.original.username),
      }),

      accessor('email', {
        header: 'Email',
        cell: ({ cell }) => cell.getValue(),
        enableColumnFilter: false,
        meta: {
          renderColumnDisplayName: () => 'Email',
        },
      }),

      accessor('role', {
        header: 'Role',
        cell: ({ cell }) => Role[cell.getValue() as keyof typeof Role],
        filterFn: setIncludes,
        meta: {
          renderFilterName: (value: string) => Role[value as keyof typeof Role],
          renderColumnDisplayName: () => 'Role',
        },
        sortingFn: (rowA, rowB) => rowA.original.role.localeCompare(rowB.original.role),
      }),

      display({
        id: 'actions',
        cell: ({ row }) => (
          <div className={styles.actionsMenu}>
            {row.original.id !== currentUser.id && <UserActionMenu user={row.original} />}
          </div>
        ),
        enableHiding: false,
        size: 50,
      }),
    ],
    [currentUser.id]
  );

  return useReactTable({
    data: users,
    columns,
    initialState: {
      sorting: [{ id: 'username', desc: false }],
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

import { useDataTable } from '@/shared/hooks/useDataTable.ts';
import { useUserList } from '@/features/user/hooks/useUserList.ts';
import { Role, User } from '@/features/user/types.ts';
import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/DataTable.tsx';
import { formatTimeAgo } from '@/utils/formatTimeAgo.ts';
import { UsersOptionMenu } from '@/features/user/components/UsersOptionMenu.tsx';
import { ActionIcon, Group, Stack } from '@mantine/core';
import { RoleBadge } from '@/features/user/components/RoleBadge.tsx';
import { DataTablePagination } from '@/shared/components/DataTablePagination.tsx';
import { DataTableSearch } from '@/shared/components/DataTableSearch.tsx';
import { ColumnFilterSelect } from '@/shared/components/ColumnFilterSelect.tsx';
import { ArrowDownUp, Shield } from 'lucide-react';
import { useTableSearch } from '@/shared/hooks/useTableSearch.ts';

export function UsersTable() {
  const { data: users } = useUserList();

  const { accessor, display } = createColumnHelper<User>();
  const columns = React.useMemo(
    () => [
      accessor('username', {
        header: ({ column }) => (
          <Group wrap="nowrap">
            <ActionIcon variant="transparent" onClick={() => column.toggleSorting()} size="xs">
              <ArrowDownUp size={14} />
            </ActionIcon>
            Username
          </Group>
        ),
        sortingFn: 'alphanumeric',
      }),
      accessor('email', {
        header: ({ column }) => (
          <Group wrap="nowrap">
            <ActionIcon variant="transparent" onClick={() => column.toggleSorting()} size="xs">
              <ArrowDownUp size={14} />
            </ActionIcon>
            Email
          </Group>
        ),
        sortingFn: 'alphanumeric',
      }),
      accessor('role', {
        header: 'Role',
        cell: ({ row }) => <RoleBadge role={row.original.role} />,
        filterFn: 'equalsString',
      }),
      accessor('createdAt', {
        header: ({ column }) => (
          <Group wrap="nowrap">
            <ActionIcon variant="transparent" onClick={() => column.toggleSorting()} size="xs">
              <ArrowDownUp size={14} />
            </ActionIcon>
            Created At
          </Group>
        ),
        cell: ({ row }) => formatTimeAgo(new Date(row.original.createdAt)),
        sortingFn: 'datetime',
      }),
      display({
        id: 'action',
        header: 'Actions',
        cell: ({ row }) => <UsersOptionMenu user={row.original} />,
      }),
    ],
    []
  );

  const table = useDataTable<User>({
    data: Object.values(users),
    columns,
    search: useTableSearch(),
    initialState: {
      sorting: [
        {
          id: 'createdAt',
          desc: true
        }
      ]
    }
  });

  return (
    <Stack>
      <Group>
        <DataTableSearch width={500} table={table} placeholder="Search any user..." />
        <ColumnFilterSelect
          leftSection={<Shield size={16} />}
          table={table}
          columnId="role"
          placeholder="Filter by role..."
          data={Object.entries(Role).map(([key, label]) => ({
            value: key,
            label,
          }))}
          w={200}
        />
      </Group>
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </Stack>
  );
}

import { ListEnd } from 'lucide-react';
import { Divider, Group, Pagination, Select, Text } from '@mantine/core';
import { Table } from '@tanstack/react-table';

type Props<TData> = {
  table: Table<TData>;
};

export function DataTablePagination<TData>({ table }: Props<TData>) {
  const { pageSize, pageIndex } = table.getState().pagination;
  const PAGE_SIZES = ['5', '7', '10', '20', '50'];

  return (
    <Group justify="space-between">
      <Group>
        <Group gap="sm">
          <Group gap="xs">
            <ListEnd size={18} />
            <Text size="sm">Rows per page</Text>
          </Group>
          <Select
            data={PAGE_SIZES}
            value={pageSize.toString()}
            onChange={(value) =>
              table.setPagination({
                pageIndex: 0,
                pageSize: parseInt(value || '7'),
              })
            }
            w={70}
          />
        </Group>
        <Divider orientation="vertical" />
        <Text c="dimmed" size="sm">
          {table.getRowCount()} row(s) total.
        </Text>
      </Group>

      <Group>
        <Text size="sm">
          Page {pageIndex + 1} of {table.getPageCount() === 0 ? 1 : table.getPageCount()}
        </Text>

        <Pagination
          total={table.getPageCount()}
          onChange={(page) =>
            table.setPagination({
              pageIndex: page - 1,
              pageSize: pageSize,
            })
          }
          value={pageIndex + 1}
          withPages={false}
        />
      </Group>
    </Group>
  );
}

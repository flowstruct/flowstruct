import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { Search, X } from 'lucide-react';
import { ActionIcon, Input, Loader } from '@mantine/core';
import { Table } from '@tanstack/react-table';

type TableSearchProps<TData> = {
  table: Table<TData>;
  width?: number | string;
  placeholder?: string;
  debounce?: number;
  loading?: boolean;
};

export function DataTableSearch<TData>({
  table,
  width = 450,
  placeholder = 'Search...',
  debounce = 0,
  loading = false,
}: TableSearchProps<TData>) {
  const [value, setValue] = useState((table.getState().globalFilter as string) || '');
  const [debounced] = useDebouncedValue(value, debounce);

  useEffect(() => {
    table.setGlobalFilter(debounced);
  }, [debounced, table]);

  return (
    <Input
      data-autofocus
      flex={1}
      w={width}
      leftSection={<Search size={18} />}
      placeholder={placeholder}
      value={value}
      rightSectionPointerEvents="all"
      rightSection={
        value !== '' &&
        (loading ? (
          <Loader color="gray" size="xs" />
        ) : (
          <ActionIcon radius="xl" variant="white" color="gray" onClick={() => setValue('')}>
            <X size={18} />
          </ActionIcon>
        ))
      }
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

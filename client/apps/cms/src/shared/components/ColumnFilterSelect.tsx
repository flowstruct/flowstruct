import { Select, SelectProps } from '@mantine/core';
import { Table } from '@tanstack/react-table';

type InferTableData<T> = T extends Table<infer Row> ? Row : never;

function ColumnFilterSelectInner<TData>({
  table,
  columnId,
  ...selectProps
}: {
  table: Table<TData>;
  columnId: keyof TData;
} & SelectProps) {
  const column = table.getColumn(columnId as string);
  const value = (column?.getFilterValue() as string) ?? '';

  return (
    <Select
      {...selectProps}
      value={value}
      onChange={(val) => column?.setFilterValue(val)}
      clearable
    />
  );
}

type WrapperProps<T extends Table<any>> = {
  table: T;
  columnId: keyof InferTableData<T>;
} & SelectProps;

export function ColumnFilterSelect<T extends Table<any>>({
  table,
  columnId,
  placeholder = 'Filter...',
  ...selectProps
}: WrapperProps<T>) {
  return (
    <ColumnFilterSelectInner
      table={table}
      columnId={columnId}
      placeholder={placeholder}
      {...selectProps}
    />
  );
}

import { flexRender, Table as TanStackTable } from '@tanstack/react-table';
import { Cell, Row, Table, TableBody, TableHeader } from '../ui2/Table';

type DataTableProps<TData> = {
  table: TanStackTable<TData>;
};

export function DataTable<TData>({ table }: DataTableProps<TData>) {
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Cell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </Cell>
            ))}
          </Row>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <Row
              key={row.id}
              // opacity={row.getCanSelect() ? '100%' : '50%'}
              bg={row.getIsSelected() ? 'var(--mantine-primary-color-light)' : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Cell>
              ))}
            </Row>
          ))
        ) : (
          <Row>
            <Cell colSpan={table.getLeafHeaders().length}>No results.</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

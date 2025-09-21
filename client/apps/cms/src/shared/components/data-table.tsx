import { Table as TanStackTable } from '@tanstack/table-core';
import { flexRender } from '@tanstack/react-table';
import { SearchX } from 'lucide-react';
import classes from './DataTable.module.css';

type DataTableProps<TData> = {
  table: TanStackTable<TData>;
};

export function DataTable<TData>({ table }: DataTableProps<TData>) {
  return (
    <table className={classes.table}>
      <thead className={classes.thead}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className={classes.headerRow}>
          {headerGroup.headers.map((header) => (
            <th key={header.id} className={classes.th}>
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody className={classes.tbody}>
      {table.getRowModel().rows.length ? (
        table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={`${classes.tr} ${
              row.getIsSelected() ? classes.selected : ''
            } ${!row.getCanSelect() ? classes.disabled : ''}`}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={classes.td}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr className={classes.emptyRow}>
          <td colSpan={table.getLeafHeaders().length} className={classes.emptyCell}>
            <div className={classes.emptyContent}>
              <SearchX size={16} className={classes.emptyIcon} />
              <span className={classes.emptyText}>No results.</span>
            </div>
          </td>
        </tr>
      )}
      </tbody>
    </table>
  );
}
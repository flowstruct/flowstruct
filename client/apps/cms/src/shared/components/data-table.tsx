import { flexRender, Table as TanStackTable } from '@tanstack/react-table';
import { SearchX } from 'lucide-react';
import styles from '@/shared/components/data-table.module.css';

type DataTableProps<TData> = {
  table: TanStackTable<TData>;
};

export function DataTable<TData>({ table }: DataTableProps<TData>) {
  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className={styles.headerRow}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className={styles.th}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className={styles.tbody}>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`${styles.tr} ${
                row.getIsSelected() ? styles.selected : ''
              } ${!row.getCanSelect() ? styles.disabled : ''}`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr className={styles.emptyRow}>
            <td colSpan={table.getLeafHeaders().length} className={styles.emptyCell}>
              <div className={styles.emptyContent}>
                <SearchX size={16} className={styles.emptyIcon} />
                <span className={styles.emptyText}>No results.</span>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

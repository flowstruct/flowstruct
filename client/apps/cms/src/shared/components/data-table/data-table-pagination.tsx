import { Table } from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './data-table-pagination.module.css';

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  isLoading?: boolean;
};

export function DataTablePagination<TData>({ table, isLoading }: DataTablePaginationProps<TData>) {
  const { pageIndex } = table.getState().pagination;

  const rowCount = table.options.rowCount ?? table.getRowCount();
  const pageCount = table.options.pageCount ?? table.getPageCount();

  return (
    <section className={styles.pagination}>
      <div className={styles.left}>
        <span className={styles.rowCount}>{rowCount} row(s) total</span>
      </div>

      <div className={styles.right}>
        <span className={styles.pageInfo}>
          Page {pageIndex + 1} of {pageCount === 0 ? 1 : pageCount}
        </span>

        <div className={styles.pageButtons}>
          <Button
            variant="ghost"
            size="xs"
            shape="icon"
            onPress={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage() || isLoading}
          >
            <ChevronLeft size={14} />
          </Button>

          <Button
            variant="ghost"
            size="xs"
            shape="icon"
            onPress={() => table.nextPage()}
            isDisabled={!table.getCanNextPage() || isLoading}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </section>
  );
}


import { Table } from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/Button';
import { Select, SelectItem } from '@/shared/components/ui/Select';
import { ChevronLeft, ChevronRight, ListEnd } from 'lucide-react';
import styles from './data-table-pagination.module.css';

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  isLoading?: boolean;
};

export function DataTablePagination<TData>({ table, isLoading }: DataTablePaginationProps<TData>) {
  const { pageSize, pageIndex } = table.getState().pagination;
  const PAGE_SIZES = ['5', '10', '20', '50'];

  const pageCount = table.getPageCount();

  return (
    <section className={styles.pagination}>
      <div className={styles.left}>
        <div className={styles.pageSize}>
          <ListEnd size={14} />
          <span>Rows per page</span>
          <Select
            items={PAGE_SIZES.map((size) => ({ id: size, name: size }))}
            value={String(pageSize)}
            onChange={(key) =>
              table.setPagination({
                pageIndex: 0,
                pageSize: parseInt(key as string),
              })
            }
            size="xs"
            aria-label="Rows per page"
            isDisabled={isLoading}
          >
            {(item) => <SelectItem>{item.name}</SelectItem>}
          </Select>
        </div>

        <span className={styles.rowCount}>{table.getRowCount()} row(s) total</span>
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


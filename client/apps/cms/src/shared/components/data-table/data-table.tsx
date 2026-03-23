import { Column, flexRender, Row, Table as TanStackTable } from '@tanstack/react-table';
import { ListFilter } from 'lucide-react';
import styles from '@/shared/components/data-table/data-table.module.css';
import { MenuTrigger } from '@/shared/components/ui/Menu';
import { Button } from '@/shared/components/ui/Button';
import { Popover } from '@/shared/components/ui/Popover';
import { Autocomplete } from '@/shared/components/ui/Autocomplete';
import { GridList, GridListItem } from '@/shared/components/ui/GridList';
import React from 'react';
import { AriaButtonProps, useButton, useFilter, useFocusRing, useHover } from 'react-aria';
import { ListEmptyState } from '@/shared/components/ui/ListBox';
import { SearchField } from '@/shared/components/ui/SearchField';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';

type DataTableProps<TData> = {
  table: TanStackTable<TData>;
  isLoading: boolean;
};

export function DataTable<TData>({ table, isLoading }: DataTableProps<TData>) {
  return (
    <>
      <table className={styles.table}>
        <thead className={styles.thead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles.headerRow}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} className={styles.th}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          key={header.id}
                          className={styles.headerCell}
                          style={{ width: header.getSize() }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}

                          {header.column.getCanFilter() && <FilterMenu column={header.column} />}
                        </div>
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className={styles.tbody}>
          {isLoading ? (
            Array.from({ length: table.getState().pagination.pageSize }).map((_, i) => (
              <tr key={`skeleton-${i}`} className={styles.tr}>
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <td key={header.id} className={styles.td}>
                    <div className={styles.skeletonCell} />
                  </td>
                ))}
              </tr>
            ))
          ) : table.getRowModel().rows.length ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <Tr key={row.id} onPress={() => table.options.meta?.rowAction(row)} row={row} />
              ))
          ) : (
            <tr className={styles.emptyRow}>
              <td colSpan={table.getLeafHeaders().length} className={styles.emptyCell}>
                <div className={styles.emptyContent}>
                  <span className={styles.emptyText}>No results.</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <DataTablePagination table={table} isLoading={isLoading} />
    </>
  );
}

interface TrProps<TData> extends AriaButtonProps<'button'> {
  row: Row<TData>;
}

function Tr<TData>({ row, ...props }: TrProps<TData>) {
  const ref = React.useRef<HTMLTableRowElement>(null);
  const { buttonProps, isPressed } = useButton(props, ref);
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocused } = useFocusRing(props);

  return (
    <tr
      {...buttonProps}
      {...hoverProps}
      {...focusProps}
      ref={ref}
      key={row.id}
      className={`${styles.tr} ${
        row.getIsSelected() ? styles.selected : ''
      } ${!row.getCanSelect() ? styles.disabled : ''}`}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className={styles.td}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

function FilterMenu({ column }: { column: Column<any, unknown> }) {
  const { contains } = useFilter({ sensitivity: 'base' });

  const renderFilterName = column.columnDef.meta?.renderFilterName;

  const memoizedRenderFilterName = React.useCallback(
    (value: any) => (renderFilterName ? renderFilterName(value) : String(value)),
    [renderFilterName]
  );

  const items = React.useMemo(() => {
    return Array.from(column.getFacetedUniqueValues().keys()).map((value) => ({
      id: value,
      name: memoizedRenderFilterName(value),
    }));
  }, [column, memoizedRenderFilterName]);

  const selectedKeys = (() => {
    const value = column.getFilterValue();
    return value ? (value as Set<any>) : new Set<any>();
  })();

  return (
    <MenuTrigger>
      <Button showIndicator={column.getIsFiltered()} variant="transparent" size="xs">
        <ListFilter size={15} />
      </Button>

      <Popover aria-label="Filter" hideArrow>
        <Autocomplete filter={contains}>
          <SearchField autoFocus />
          <GridList
            renderEmptyState={() => <ListEmptyState>No results.</ListEmptyState>}
            aria-label="filter options"
            items={items}
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => {
              const keySet = keys as Set<any>;
              column.setFilterValue(keySet.size === 0 ? undefined : keySet);
            }}
          >
            {(item) => <GridListItem textValue={item.name}>{item.name}</GridListItem>}
          </GridList>
        </Autocomplete>

        {column.getIsFiltered() && (
          <footer className={styles.filterMenuFooter}>
            <Button
              variant="ghost"
              size="xs"
              onPress={() => column.setFilterValue(undefined)}
              className={styles.resetFilterButton}
            >
              Reset
            </Button>
          </footer>
        )}
      </Popover>
    </MenuTrigger>
  );
}

import { Column, flexRender, Table as TanStackTable } from '@tanstack/react-table';
import { ListFilter, SearchX, X } from 'lucide-react';
import styles from '@/shared/components/data-table/data-table.module.css';
import { MenuTrigger } from '@/shared/components/ui/Menu.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import {Button as RACButton } from 'react-aria-components';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { Autocomplete } from '@/shared/components/ui/Autocomplete.tsx';
import { GridList, GridListItem } from '@/shared/components/ui/GridList.tsx';
import React from 'react';

type DataTableProps<TData> = {
  table: TanStackTable<TData>;
};

export function DataTable<TData>({ table }: DataTableProps<TData>) {
  return (
    <>
      <table className={styles.table}>
        <thead className={styles.thead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles.headerRow}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.th}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div className={styles.headerCell}>
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {header.column.getCanFilter() && <FilterMenu column={header.column} />}
                      </div>
                    </>
                  )}
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
                  <span className={styles.emptyText}>No results.</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

function FilterMenu({ column }: { column: Column<any, unknown> }) {
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
      <Button showIndicator={column.getIsFiltered()} variant="transparent" size="sm">
        <ListFilter size={15} />
      </Button>

      <Popover aria-label="Filter" hideArrow>
        <Autocomplete>
          <GridList
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
          <RACButton
            onPress={() => column.setFilterValue(undefined)}
            className={styles.clearFilterButton}
          >
            <X size={15} /> Clear
          </RACButton>
        )}
      </Popover>
    </MenuTrigger>
  );
}

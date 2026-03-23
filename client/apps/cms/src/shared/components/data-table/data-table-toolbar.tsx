import styles from './data-table-toolbar.module.css';
import { Table } from '@tanstack/react-table';
import { DialogTrigger } from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  ListEnd,
  Settings2,
  X,
} from 'lucide-react';
import { Popover } from '@/shared/components/ui/Popover';
import { Select, SelectItem } from '@/shared/components/ui/Select';
import { SearchField } from '@/shared/components/ui/SearchField';
import React from 'react';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Divider } from '@/shared/components/ui/divider';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip';

type DataTableToolbarProps<TData> = {
  enableSearch?: boolean;
  table: Table<TData>;
  isLoading?: boolean;
};

export function DataTableToolbar<TData>({
  enableSearch = false,
  table,
  isLoading = false,
}: DataTableToolbarProps<TData>) {
  return (
    <section className={styles.toolbar}>
      <ClearColumnFilters table={table} />
      {enableSearch && <DataTableSearch table={table} isLoading={isLoading} />}
      <DataTableSettings table={table} />
    </section>
  );
}

function ClearColumnFilters<TData>({ table }: { table: Table<TData> }) {
  const columnFiltersApplied = table.getState().columnFilters.length;

  if (columnFiltersApplied === 0) {
    return null;
  }

  return (
    <Button onPress={() => table.resetColumnFilters()} variant="ghost" size="sm">
      <X size={14} /> {columnFiltersApplied} filter(s)
    </Button>
  );
}

function DataTableSearch<TData>({
  table,
  isLoading,
}: {
  table: Table<TData>;
  isLoading?: boolean;
}) {
  const initialFilter = table.getState().globalFilter;
  const [search, setSearch] = React.useState<string>((initialFilter as string) ?? '');
  const debouncedSearch = useDebounce(search);

  React.useEffect(() => {
    table.setGlobalFilter(debouncedSearch);
  }, [debouncedSearch, table]);

  return (
    <SearchField
      aria-label="Search table"
      isLoading={isLoading}
      value={search}
      onChange={setSearch}
    />
  );
}

function DataTableSettings<TData>({ table }: DataTableSettingsProps<TData>) {
  return (
    <DialogTrigger>
      <TooltipTrigger>
        <Button size="sm" variant="transparent">
          <Settings2 size={14} />
        </Button>

        <Tooltip>Table settings</Tooltip>
      </TooltipTrigger>

      <Popover crossOffset={-90}>
        {table.getState().sorting.length !== 0 && (
          <>
            <div className={styles.option}>
              <SortingOptions table={table} />
            </div>

            <Divider />
          </>
        )}

        <div className={styles.option}>
          <RowsPerPageOptions table={table} />
        </div>

        <Divider />

        <div className={styles.option}>
          <ColumnVisibilityPills table={table} />
        </div>
      </Popover>
    </DialogTrigger>
  );
}

type DataTableSettingsProps<TData> = {
  table: Table<TData>;
};

function RowsPerPageOptions<TData>({ table }: { table: Table<TData> }) {
  const { pageSize } = table.getState().pagination;
  const PAGE_SIZES = ['5', '10', '20', '50'];

  return (
    <section className={styles.horizontalOption}>
      <p className={styles.label}>
        <ListEnd size={14} />
        Rows
      </p>

      <div className={styles.optionActions}>
        <Select
          items={PAGE_SIZES.map((size) => ({ id: size, name: size }))}
          value={String(pageSize)}
          onChange={(key) =>
            table.setPagination({ pageIndex: 0, pageSize: parseInt(key as string) })
          }
          size="xs"
          aria-label="Rows per page"
        >
          {(item) => <SelectItem>{item.name}</SelectItem>}
        </Select>
      </div>
    </section>
  );
}

function SortingOptions<TData>({ table }: { table: Table<TData> }) {
  const sortingState = table.getState().sorting[0];
  if (!sortingState) return <p>No sorting options.</p>;

  const items = table
    .getAllLeafColumns()
    .filter((c) => c.getCanSort())
    .map((c) => {
      const renderColumnDisplayName = c.columnDef.meta?.renderColumnDisplayName;
      return { id: c.id, name: renderColumnDisplayName ? renderColumnDisplayName() : c.id };
    });

  return (
    <section className={styles.horizontalOption}>
      <p className={styles.label}>
        <ArrowUpDown size={14} />
        Sorting
      </p>

      <div className={styles.optionActions}>
        <Button
          variant="flat"
          size="xs"
          shape="icon"
          onPress={() => table.setSorting([{ ...sortingState, desc: !sortingState.desc }])}
        >
          {sortingState.desc ? <ArrowUpNarrowWide size={14} /> : <ArrowDownWideNarrow size={14} />}
        </Button>
        <Select
          placeholder="Select column"
          size="xs"
          items={items}
          aria-label="Sort by column"
          value={sortingState.id}
          onChange={(key) => table.setSorting([{ ...sortingState, id: key as string }])}
        >
          {(item) => <SelectItem>{item.name}</SelectItem>}
        </Select>
      </div>
    </section>
  );
}

function ColumnVisibilityPills<TData>({ table }: { table: Table<TData> }) {
  return (
    <section className={styles.verticalOption}>
      <p className={styles.label}>Display properties</p>

      <div className={styles.columnPills}>
        {table.getAllLeafColumns().map((c) => {
          const name = c.columnDef.meta?.renderColumnDisplayName() ?? c.id;

          if (!c.getCanHide()) {
            return;
          }

          return (
            <Button
              key={name}
              size="xs"
              variant="flat"
              data-active={c.getIsVisible() || undefined}
              className={styles.columnPill}
              onPress={() => c.toggleVisibility()}
            >
              {name}
            </Button>
          );
        })}
      </div>
    </section>
  );
}

import styles from './data-table-toolbar.module.css';
import { Table } from '@tanstack/react-table';
import { DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Search,
  Settings2,
  X,
} from 'lucide-react';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { Select, SelectItem } from '@/shared/components/ui/Select.tsx';
import { SearchField } from '@/shared/components/ui/SearchField.tsx';
import React from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce.ts';
import { Divider } from '@/shared/components/ui/divider.tsx';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  return (
    <section className={styles.toolbar}>
      <ClearColumnFilters table={table} />
      <DataTableSearch table={table} />
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

function DataTableSearch<TData>({ table }: { table: Table<TData> }) {
  const [search, setSearch] = React.useState<string>('');
  const debouncedSearch = useDebounce(search);

  React.useEffect(() => {
    table.setGlobalFilter(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <SearchField
      aria-label="Search table"
      icon={<Search size={14} />}
      value={search}
      onChange={setSearch}
    />
  );
}

function DataTableSettings<TData>({ table }: { table: Table<TData> }) {
  return (
    <DialogTrigger>
      <TooltipTrigger>
        <Button size="sm" variant="transparent">
          <Settings2 size={14} />
        </Button>

        <Tooltip>Table settings</Tooltip>
      </TooltipTrigger>

      <Popover crossOffset={-64}>
        <div className={styles.option}>
          <SortingOptions table={table} />
        </div>

        <Divider />

        <div className={styles.option}>
          <ColumnVisibilityPills table={table} />
        </div>
      </Popover>
    </DialogTrigger>
  );
}

function SortingOptions<TData>({ table }: { table: Table<TData> }) {
  const sortingState = table.getState().sorting[0];
  if (!sortingState) return null;

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
        <Select
          placeholder="Select column"
          size="xs"
          items={items}
          selectedKey={sortingState.id}
          onSelectionChange={(key) => table.setSorting([{ ...sortingState, id: key as string }])}
        >
          {(item) => <SelectItem>{item.name}</SelectItem>}
        </Select>

        <Button
          variant="flat"
          size="icon"
          onPress={() => table.setSorting([{ ...sortingState, desc: !sortingState.desc }])}
        >
          {sortingState.desc ? <ArrowUpNarrowWide size={14} /> : <ArrowDownWideNarrow size={14} />}
        </Button>
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

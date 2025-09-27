import styles from './data-table-toolbar.module.css';
import { Table } from '@tanstack/react-table';
import { Dialog, DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Search,
  Settings2,
} from 'lucide-react';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { Select, SelectItem } from '@/shared/components/ui/Select.tsx';
import { SearchField } from '@/shared/components/ui/SearchField.tsx';
import React from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce.ts';

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  return (
    <section className={styles.toolbar}>
      <DataTableSearch table={table} />

      <DataTableViewOptions table={table} />
    </section>
  );
}

function DataTableSearch<TData>({ table }: { table: Table<TData> }) {
  const [search, setSearch] = React.useState<string>('');
  const debouncedSearch = useDebounce(search);

  React.useEffect(() => {
    table.setGlobalFilter(search);
  }, [debouncedSearch]);

  return <SearchField aria-label="Search table" icon={<Search size={14} />} value={search} onChange={setSearch} />;
}

function DataTableViewOptions<TData>({ table }: { table: Table<TData> }) {
  return (
    <DialogTrigger>
      <Button variant="transparent" size="md">
        <Settings2 size={14} />
      </Button>

      <Popover crossOffset={-64}>
        <Dialog>
          <div className={styles.viewOption}>
            <p className={styles.viewOptionLabel}>
              <ArrowUpDown size={14} />
              Sorting
            </p>
            <SortingDropdown table={table} />
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

function SortingDropdown<TData>({ table }: { table: Table<TData> }) {
  const sortingState = table.getState().sorting[0];

  if (!sortingState) return null;

  const items = table
    .getAllLeafColumns()
    .filter((c) => c.getCanSort())
    .map((c) => {
      const renderSortName = c.columnDef.meta?.renderSortName;
      return { id: c.id, name: renderSortName ? renderSortName() : c.id };
    });

  return (
    <div className={styles.sortingActions}>
      <Select
        placeholder="Select column"
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
        {sortingState.desc ? <ArrowUpNarrowWide size={16} /> : <ArrowDownWideNarrow size={16} />}
      </Button>
    </div>
  );
}

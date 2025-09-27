import styles from './data-table-toolbar.module.css';
import { Table } from '@tanstack/react-table';
import { Dialog, DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Search, Settings2 } from 'lucide-react';
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

  return <SearchField icon={<Search size={14} />} value={search} onChange={setSearch} />;
}

function DataTableViewOptions<TData>({ table }: { table: Table<TData> }) {
  return (
    <DialogTrigger>
      <Button variant="icon">
        <Settings2 size={14} />
      </Button>

      <Popover crossOffset={-64}>
        <Dialog>
          <SortingDropdown table={table} />
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

function SortingDropdown<TData>({ table }: { table: Table<TData> }) {
  const items = table
    .getAllLeafColumns()
    .filter((c) => c.getCanSort())
    .map((c) => {
      const renderSortName = c.columnDef.meta?.renderSortName;
      return { id: c.id, name: renderSortName() ?? c.id };
    });

  return <Select items={items}>{(item) => <SelectItem>{item.name}</SelectItem>}</Select>;
}

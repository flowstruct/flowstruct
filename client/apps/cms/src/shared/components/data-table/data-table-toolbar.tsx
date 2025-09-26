import styles from './data-table-toolbar.module.css';
import { Table } from '@tanstack/react-table';
import { Dialog, DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Search, Settings2 } from 'lucide-react';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { Select, SelectItem } from '@/shared/components/ui/Select.tsx';

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  return (
    <section className={styles.toolbar}>
      <Button variant="icon">
        <Search size={14} />
      </Button>

      <DataTableOptions table={table} />
    </section>
  );
}

function DataTableOptions<TData>({ table }: { table: Table<TData> }) {
  return (
    <DialogTrigger>
      <Button variant="icon">
        <Settings2 size={14} />
      </Button>

      <Popover crossOffset={-64}>
        <Dialog>
          <Select
            items={table
              .getAllLeafColumns()
              .filter((c) => c.getCanSort())
              .map((c) => ({ id: c.id, name: c.id }))}
          >
            {(item) => <SelectItem>{item.name}</SelectItem>}
          </Select>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

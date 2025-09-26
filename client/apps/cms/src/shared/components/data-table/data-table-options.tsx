import { Dialog, DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Settings2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { Table } from '@tanstack/react-table';
import { Select, SelectItem } from '@/shared/components/ui/Select.tsx';

type DataTableOptionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableOptions<TData>({ table }: DataTableOptionsProps<TData>) {
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

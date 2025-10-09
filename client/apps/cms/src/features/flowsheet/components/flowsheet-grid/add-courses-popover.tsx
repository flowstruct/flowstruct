import { Button } from '@/shared/components/ui/Button.tsx';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { Autocomplete } from '@/shared/components/ui/Autocomplete.tsx';
import { GridList, GridListItem } from '@/shared/components/ui/GridList.tsx';
import { ListEmptyState } from '@/shared/components/ui/ListBox.tsx';
import { useInfiniteQuery } from '@tanstack/react-query';
import { courseQueries } from '@/features/course/queries.ts';
import React from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce.ts';

type AddCoursesPopoverProps = {
  term: number;
};

export function AddCoursesPopover({ term }: AddCoursesPopoverProps) {
  const [search, setSearch] = React.useState<string>('');
  const debouncedSearch = useDebounce(search);

  const { data: courseSearchResults, isLoading } = useInfiniteQuery(
    courseQueries.infinite({ filter: debouncedSearch })
  );

  return (
    <DialogTrigger>
      <TooltipTrigger>
        <Button variant="ghost" size="xs">
          <Plus size={14} />
        </Button>

        <Tooltip>Add courses</Tooltip>
      </TooltipTrigger>

      <Popover aria-label={`Add courses to term ${term}`}>
        <Autocomplete
          isLoading={isLoading}
          placeholder="Find courses..."
          inputValue={search}
          onInputChange={setSearch}
        >
          <GridList
            items={courseSearchResults?.pages.flatMap((p) => p.content)}
            selectionMode="multiple"
            renderEmptyState={() => <ListEmptyState>No results.</ListEmptyState>}
          >
            {(item) => <GridListItem textValue={item.name}>{item.name}</GridListItem>}
          </GridList>
        </Autocomplete>
      </Popover>
    </DialogTrigger>
  );
}

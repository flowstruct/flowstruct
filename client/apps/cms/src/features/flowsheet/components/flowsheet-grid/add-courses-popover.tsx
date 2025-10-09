import { Button } from '@/shared/components/ui/Button.tsx';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { GridList, GridListItem } from '@/shared/components/ui/GridList.tsx';
import { ListEmptyState } from '@/shared/components/ui/ListBox.tsx';
import { useInfiniteQuery } from '@tanstack/react-query';
import { courseQueries } from '@/features/course/queries.ts';
import React from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce.ts';
import { SearchField } from '@/shared/components/ui/SearchField.tsx';
import { Autocomplete } from '@/shared/components/ui/Autocomplete.tsx';
import { DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Collection, GridListLoadMoreItem } from 'react-aria-components';
import { ProgressCircle } from '@/shared/components/ui/ProgressCircle.tsx';

type AddCoursesPopoverProps = {
  term: number;
};

export function AddCoursesPopover({ term }: AddCoursesPopoverProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const debouncedSearch = useDebounce(search);

  const {
    data: courseSearchResults,
    isLoading,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    enabled: isOpen,
    ...courseQueries.infinite({ filter: debouncedSearch }),
  });

  return (
    <DialogTrigger>
      <TooltipTrigger>
        <Button onPress={() => setIsOpen(true)} variant="ghost" size="xs">
          <Plus size={14} />
        </Button>

        <Tooltip>Add courses</Tooltip>
      </TooltipTrigger>

      <Popover isOpen={isOpen} onOpenChange={setIsOpen} aria-label={`Add courses to term ${term}`}>
        <Autocomplete inputValue={search} onInputChange={setSearch}>
          <SearchField placeholder="Find courses..." isLoading={isLoading} />

          <GridList
            selectionMode="multiple"
            renderEmptyState={() => <ListEmptyState>No results.</ListEmptyState>}
          >
            <Collection items={courseSearchResults?.pages.flatMap((p) => p.content)}>
              {(item) => <GridListItem>{item.name}</GridListItem>}
            </Collection>

            <GridListLoadMoreItem onLoadMore={fetchNextPage} isLoading={isFetching}>
              <ProgressCircle isIndeterminate aria-label="Loading more courses..." />
            </GridListLoadMoreItem>
          </GridList>
        </Autocomplete>
      </Popover>
    </DialogTrigger>
  );
}

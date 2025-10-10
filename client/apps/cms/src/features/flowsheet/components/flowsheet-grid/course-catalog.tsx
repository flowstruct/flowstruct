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
import styles from './course-catalog-finder.module.css';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';

type AddCoursesPopoverProps = { term: number };

export function CourseCatalog({ term }: AddCoursesPopoverProps) {
  const { pendingCourses, pendCoursesFromCatalog } = useFlowsheetGridContext();
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search);

  const {
    data: courseResults,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery(courseQueries.catalog({ filter: debouncedSearch }));

  const courses = courseResults?.pages.flatMap((p) => p.content) ?? [];

  return (
    <DialogTrigger>
      <TooltipTrigger>
        <Button variant="ghost" size="xs">
          <Plus size={14} />
        </Button>
        <Tooltip>Add courses</Tooltip>
      </TooltipTrigger>

      <Popover placement="right top" aria-label={`Add courses to term ${term}`}>
        <Autocomplete inputValue={search} onInputChange={setSearch}>
          <SearchField
            autoFocus
            aria-label="Search courses."
            placeholder="Search course catalog..."
            isLoading={isFetching}
          />

          <GridList
            selectedKeys={Array.from(pendingCourses.keys())}
            onSelectionChange={(selection) => {
              const keys = Array.from(selection).map(Number);
              pendCoursesFromCatalog({ term, courseIds: keys });
            }}
            selectionMode="multiple"
            renderEmptyState={() => (
              <ListEmptyState>
                <Button size="xs" variant="ghost" className={styles.createHintButton}>
                  <span className={styles.createLinkText}>Create “{debouncedSearch}”</span>
                </Button>
              </ListEmptyState>
            )}
          >
            <Collection items={courses}>
              {(item) => (
                <GridListItem id={item.id} textValue={item.name}>
                  {item.code}: {item.name}
                </GridListItem>
              )}
            </Collection>

            <GridListLoadMoreItem onLoadMore={fetchNextPage} isLoading={isFetching} />
          </GridList>
        </Autocomplete>

        {debouncedSearch && courses.length > 0 && (
          <div className={styles.createHint}>
            Can’t find what you’re looking for?{' '}
            <Button size="xs" variant="ghost" className={styles.createHintButton}>
              <span className={styles.createLinkText}>Create “{debouncedSearch}”</span>
            </Button>
          </div>
        )}
      </Popover>
    </DialogTrigger>
  );
}

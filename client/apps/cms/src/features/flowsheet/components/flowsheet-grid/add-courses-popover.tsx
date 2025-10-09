import { Button } from '@/shared/components/ui/Button.tsx';
import { BetweenHorizontalEnd, Plus } from 'lucide-react';
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
import styles from './add-courses-popover.module.css';

type AddCoursesPopoverProps = {
  term: number;
};

type Course = {
  id: number;
  code: string;
  name: string;
};

export function AddCoursesPopover({ term }: AddCoursesPopoverProps) {
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search);
  const [selectedKeys, setSelectedKeys] = React.useState<Set<number>>(new Set());
  const allCoursesRef = React.useRef<Map<number, Course>>(new Map());

  const {
    data: courseSearchResults,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery(courseQueries.infinite({ filter: debouncedSearch }));

  const courses = courseSearchResults?.pages.flatMap((p) => p.content) ?? [];

  courses.forEach((course) => {
    allCoursesRef.current.set(course.id, course);
  });

  const selectedCourses = React.useMemo(() => {
    return Array.from(selectedKeys)
      .map((id) => allCoursesRef.current.get(id))
      .filter((course): course is Course => course !== undefined);
  }, [selectedKeys]);

  return (
    <DialogTrigger>
      <TooltipTrigger>
        <Button variant="ghost" size="xs">
          <Plus size={14} />
        </Button>
        <Tooltip>Add courses</Tooltip>
      </TooltipTrigger>

      <Popover aria-label={`Add courses to term ${term}`}>
        <Autocomplete inputValue={search} onInputChange={setSearch}>
          <SearchField
            autoFocus
            aria-label="Search courses."
            placeholder="Search course catalog..."
            isLoading={isFetching}
          />

          <GridList
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            selectionMode="multiple"
            renderEmptyState={() => <ListEmptyState>No results.</ListEmptyState>}
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
            <Button
              size="xs"
              variant="ghost"
              className={styles.createHintButton}
              // onPress={() => handleCreateCourse(debouncedSearch)}
            >
              <span className={styles.createLinkText}>Create “{debouncedSearch}”</span>
            </Button>
          </div>
        )}

        {selectedKeys.size > 0 && (
          <footer className={styles.footer}>
            <Button
              size="sm"
              className={styles.resetButton}
              onPress={() => setSelectedKeys(new Set())}
              variant="transparent"
            >
              Reset
            </Button>

            <Button size="sm" className={styles.placeCoursesButton} variant="transparent">
              <BetweenHorizontalEnd size={14} /> Confirm placements
            </Button>
          </footer>
        )}
      </Popover>
    </DialogTrigger>
  );
}

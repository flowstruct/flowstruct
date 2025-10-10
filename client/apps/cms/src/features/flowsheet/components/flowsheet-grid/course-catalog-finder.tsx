import { Button } from '@/shared/components/ui/Button.tsx';
import { BetweenHorizontalEnd, Plus } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { GridList, GridListItem } from '@/shared/components/ui/GridList.tsx';
import { ListEmptyState } from '@/shared/components/ui/ListBox.tsx';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { courseQueries } from '@/features/course/queries.ts';
import React from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce.ts';
import { SearchField } from '@/shared/components/ui/SearchField.tsx';
import { Autocomplete } from '@/shared/components/ui/Autocomplete.tsx';
import { DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Collection, GridListLoadMoreItem } from 'react-aria-components';
import styles from './course-catalog-finder.module.css';
import { CourseSummary } from '@/features/course/domain/course.ts';

type AddCoursesPopoverProps = {
  term: number;
};

export function CourseCatalogFinder({ term }: AddCoursesPopoverProps) {
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search);
  const [selectedKeys, setSelectedKeys] = React.useState<Set<number>>(new Set());
  const queryClient = useQueryClient();
  const allCourseResultsRef = React.useRef<Map<number, CourseSummary>>(new Map());

  const {
    data: courseResults,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery(courseQueries.infinite({ filter: debouncedSearch }));

  React.useEffect(() => {
    updateSelectedCoursesCache(selectedKeys);
  }, [selectedKeys]);

  const courses = courseResults?.pages.flatMap((p) => p.content) ?? [];

  function updateSelectedCoursesCache(selectedKeys: Set<number>) {
    courses.forEach((course) => {
      allCourseResultsRef.current.set(course.id, course);
    });

    const selectedCourses = Array.from(selectedKeys)
      .map((id) => allCourseResultsRef.current.get(id))
      .filter((course): course is CourseSummary => course !== undefined);

    queryClient.setQueryData(['terms', term, 'courses', 'to-be-added'], selectedCourses);
  }

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

        {JSON.stringify(queryClient.getQueryData(['terms', term, 'courses', 'to-be-added']))}

        {debouncedSearch && courses.length > 0 && (
          <div className={styles.createHint}>
            Can’t find what you’re looking for?{' '}
            <Button size="xs" variant="ghost" className={styles.createHintButton}>
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

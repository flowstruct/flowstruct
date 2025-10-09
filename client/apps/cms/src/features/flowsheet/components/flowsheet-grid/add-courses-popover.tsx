import { Button } from '@/shared/components/ui/Button.tsx';
import { BetweenHorizontalEnd, ChevronDown, Plus, X } from 'lucide-react';
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
import styles from './add-courses-popover.module.css';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu.tsx';

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
    isLoading,
    isFetchingNextPage,
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
            placeholder="Find courses..."
            isLoading={isLoading}
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

            <GridListLoadMoreItem onLoadMore={fetchNextPage} isLoading={isFetchingNextPage}>
              <ProgressCircle isIndeterminate aria-label="Loading more courses..." />
            </GridListLoadMoreItem>
          </GridList>
        </Autocomplete>

        <footer className={styles.footer}>
          {selectedKeys.size > 0 && (
            <MenuTrigger>
              <Button variant="transparent" size="sm">
                {selectedKeys.size} selected
                <ChevronDown size={14} />
              </Button>

              <Popover>
                <Menu
                  selectionMode="multiple"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                  items={selectedCourses}
                >
                  {(item) => (
                    <MenuItem textValue={item.name}>
                      {item.code}: {item.name}
                    </MenuItem>
                  )}
                </Menu>

                <footer className={styles.footer}>
                  <p className={styles.filteredOutMessage}>
                    {selectedCourses.length < selectedKeys.size &&
                      `Filtered ${selectedCourses.length} out of ${selectedKeys.size}`}
                  </p>

                  <Button
                    className={styles.clearSelectionButton}
                    onPress={() => setSelectedKeys(new Set())}
                    size="xs"
                    variant="ghost"
                  >
                    <X size={14} /> Clear selected
                  </Button>
                </footer>
              </Popover>
            </MenuTrigger>
          )}

          <Button className={styles.placeCoursesButton} variant="primary" size="sm">
            <BetweenHorizontalEnd size={14} />
            Place courses
          </Button>
        </footer>
      </Popover>
    </DialogTrigger>
  );
}

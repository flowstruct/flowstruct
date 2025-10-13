import { Button } from '@/shared/components/ui/Button.tsx';
import { BetweenHorizonalStart, ChevronDown, Plus } from 'lucide-react';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { GridList, GridListItem } from '@/shared/components/ui/GridList.tsx';
import { ListEmptyState } from '@/shared/components/ui/ListBox.tsx';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { courseQueries } from '@/features/course/queries.ts';
import React from 'react';
import { useDebounce } from '@/shared/hooks/use-debounce.ts';
import { SearchField } from '@/shared/components/ui/SearchField.tsx';
import { Autocomplete } from '@/shared/components/ui/Autocomplete.tsx';
import { DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Collection, GridListLoadMoreItem } from 'react-aria-components';
import styles from './course-catalog-autocomplete.module.css';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu.tsx';
import { getCourseDisplayName } from '@/features/course/domain/getCourseDisplayName.ts';
import { useCourseCatalogSearchResults } from '@/features/course/hooks/use-course-catalog-search-results.ts';
import { useDisclosure } from '@/shared/hooks/use-disclosure.ts';
import { motion } from 'framer-motion';

type AddCoursesPopoverProps = { term: number };

export function CourseCatalogAutocomplete({ term }: AddCoursesPopoverProps) {
  const { flowsheet, flowsheetCourses } = useFlowsheetContext();
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search);
  const [selectedKeys, setSelectedKeys] = React.useState<Set<number>>(new Set());
  const courseCatalogSearchResults = useCourseCatalogSearchResults();
  const dialogDisclosure = useDisclosure();

  const placeCourses = useMutation({
    mutationFn: () =>
      flowsheetApi.placeCourses({
        flowsheetId: flowsheet.id,
        courseIds: Array.from(selectedKeys),
        term,
      }),
    onSuccess: () => {
      setSelectedKeys(new Set());
      setSearch('');
      dialogDisclosure.close();
    },
  });

  const {
    data: catalogCourses,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery(courseQueries.catalog({ filter: debouncedSearch }));

  const suggestCreateCourse = debouncedSearch && (catalogCourses?.results.length ?? 0) > 0;

  return (
    <motion.div layout>
      <DialogTrigger>
        <Button aria-label="Add courses" onPress={dialogDisclosure.open} variant="ghost" size="xs">
          <Plus size={14} />
        </Button>

        <Popover
          isOpen={dialogDisclosure.isOpen}
          onOpenChange={dialogDisclosure.setIsOpen}
          aria-label={`Add courses to term ${term}`}
        >
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
              renderEmptyState={() => (
                <ListEmptyState>
                  <Button size="xs" variant="ghost" className={styles.createHintButton}>
                    <span className={styles.createLinkText}>Create “{debouncedSearch}”</span>
                  </Button>
                </ListEmptyState>
              )}
            >
              <Collection items={catalogCourses?.results}>
                {(item) => (
                  <GridListItem
                    id={item.id}
                    isDisabled={!!flowsheetCourses.byIds[item.id]}
                    textValue={item.name}
                  >
                    {item.code}: {item.name}
                  </GridListItem>
                )}
              </Collection>

              <GridListLoadMoreItem onLoadMore={fetchNextPage} isLoading={isFetching} />
            </GridList>
          </Autocomplete>

          {suggestCreateCourse && (
            <div className={styles.createHint}>
              Can’t find what you’re looking for?{' '}
              <Button size="xs" variant="ghost" className={styles.createHintButton}>
                <span className={styles.createLinkText}>Create “{debouncedSearch}”</span>
              </Button>
            </div>
          )}

          {selectedKeys.size > 0 && (
            <footer className={styles.footer}>
              <MenuTrigger>
                <Button className={styles.selectedCoursesMenu} variant="flat" size="xs">
                  {selectedKeys.size} selected
                  <ChevronDown size={14} />
                </Button>

                <Popover>
                  <Menu
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    selectionMode="multiple"
                    items={Array.from(selectedKeys).map((k) => {
                      const course = courseCatalogSearchResults.get(k);

                      if (flowsheetCourses.byIds[k] !== undefined) {
                        setSelectedKeys((prev) => {
                          const updated = new Set(prev);
                          updated.delete(k);

                          return updated;
                        });
                      }

                      return {
                        id: k,
                        name: course ? getCourseDisplayName(course) : 'Unknown',
                      };
                    })}
                  >
                    {(item) => (
                      <MenuItem id={item.id} textValue={item.name}>
                        {item.name}
                      </MenuItem>
                    )}
                  </Menu>
                </Popover>
              </MenuTrigger>

              <Button
                className={styles.resetButton}
                onPress={() => setSelectedKeys(new Set())}
                variant="ghost"
                size="sm"
              >
                Reset
              </Button>

              <Button
                className={styles.placeCoursesButton}
                onPress={() => placeCourses.mutate()}
                isPending={placeCourses.isPending}
                variant="transparent"
                size="sm"
              >
                <BetweenHorizonalStart size={14} /> Place courses
              </Button>
            </footer>
          )}
        </Popover>
      </DialogTrigger>
    </motion.div>
  );
}

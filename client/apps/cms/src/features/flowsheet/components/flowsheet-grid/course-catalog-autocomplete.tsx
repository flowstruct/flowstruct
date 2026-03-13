import { Button } from '@/shared/components/ui/Button';
import { BetweenHorizonalStart, ChevronDown, Plus } from 'lucide-react';
import { Popover } from '@/shared/components/ui/Popover';
import { GridList, GridListItem } from '@/shared/components/ui/GridList';
import { ListEmptyState } from '@/shared/components/ui/ListBox';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import React from 'react';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { SearchField } from '@/shared/components/ui/SearchField';
import { Autocomplete } from '@/shared/components/ui/Autocomplete';
import { DialogTrigger } from '@/shared/components/ui/Dialog';
import { Collection, GridListLoadMoreItem } from 'react-aria-components';
import styles from './course-catalog-autocomplete.module.css';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context';
import { flowsheetApi } from '@/features/flowsheet/api';
import { MenuTrigger } from '@/shared/components/ui/Menu';
import { getCourseDisplayName } from '@/features/course/domain/getCourseDisplayName';
import { useCourseCatalogSearchResults } from '@/features/course/hooks/use-course-catalog-search-results';
import { useDisclosure } from '@/shared/hooks/use-disclosure';
import { courseQueries } from '@/features/course/queries';
import { useTermContext } from '@/features/flowsheet/contexts/term-context';
import { CreateCourseForm } from './create-course-form';
import { Course } from '@/features/course/domain/course';

export function CourseCatalogAutocomplete() {
  const { flowsheet, flowsheetCourses } = useFlowsheetContext();
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search);
  const [selectedKeys, setSelectedKeys] = React.useState<Set<number>>(new Set());
  const dialog = useDisclosure();
  const courseFormState = useDisclosure();
  const { term } = useTermContext();

  const placeCourses = useMutation({
    mutationFn: () =>
      flowsheetApi.placeCourses({
        flowsheetId: flowsheet.id,
        courseIds: Array.from(selectedKeys),
        term: term.id,
      }),
    onSuccess: () => {
      setSelectedKeys(new Set());
      setSearch('');
      dialog.close();
    },
  });

  const {
    data: catalogCourses,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery(courseQueries.catalog({ filter: debouncedSearch }));

  const suggestCreateCourse = debouncedSearch && (catalogCourses?.results.length ?? 0) > 0;

  const handleCourseCreated = (course: Course) => {
    setSelectedKeys((prev) => new Set([...prev, course.id]));
  };

  return (
    <>
      <DialogTrigger>
        <Button
          aria-label="Add courses"
          onPress={dialog.open}
          variant="ghost"
          shape="icon"
          size="xs"
        >
          <Plus size={14} />
        </Button>

        <Popover
          isOpen={dialog.isOpen}
          onOpenChange={dialog.setIsOpen}
          aria-label={`Add courses to term ${term}`}
        >
          {courseFormState.isOpen ? (
            <CreateCourseForm
              courseFormState={courseFormState}
              onCourseCreated={handleCourseCreated}
            />
          ) : (
            <>
              <Autocomplete inputValue={search} onInputChange={setSearch}>
                <SearchField
                  autoFocus
                  aria-label="Search courses."
                  placeholder="Search course catalog..."
                  isLoading={isFetching}
                />

                <GridList
                  selectedKeys={selectedKeys}
                  onSelectionChange={(selection) => {
                    if (selection === 'all') return;

                    setSelectedKeys(selection);
                  }}
                  selectionMode="multiple"
                  renderEmptyState={() => (
                    <ListEmptyState>
                      <Button
                        size="xs"
                        variant="ghost"
                        className={styles.createHintButton}
                        onPress={courseFormState.open}
                      >
                        <span className={styles.createLinkText}>Create "{debouncedSearch}"</span>
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
                  Can't find what you're looking for?{' '}
                  <Button
                    size="xs"
                    variant="ghost"
                    className={styles.createHintButton}
                    onPress={courseFormState.open}
                  >
                    <span className={styles.createLinkText}>Create "{debouncedSearch}"</span>
                  </Button>
                </div>
              )}

              {selectedKeys.size > 0 && (
                <footer className={styles.footer}>
                  <SelectedCourses
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    removeSelection={(k: number) =>
                      setSelectedKeys((prev) => {
                        const updated = new Set(prev);
                        updated.delete(k);

                        return updated;
                      })
                    }
                  />

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
            </>
          )}
        </Popover>
      </DialogTrigger>
    </>
  );
}

type SelectedCoursesProps = {
  selectedKeys: Set<number>;
  onSelectionChange: (keys: Set<number>) => void;
  removeSelection: (key: number) => void;
};

function SelectedCourses({
  selectedKeys,
  onSelectionChange,
  removeSelection,
}: SelectedCoursesProps) {
  const { flowsheetCourses } = useFlowsheetContext();
  const courseCatalogSearchResults = useCourseCatalogSearchResults();

  return (
    <MenuTrigger>
      <Button className={styles.selectedCoursesMenu} variant="flat" size="xs">
        {selectedKeys.size} selected
        <ChevronDown size={14} />
      </Button>

      <Popover>
        <GridList
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChange}
          selectionMode="multiple"
          items={Array.from(selectedKeys).map((k) => {
            const course = courseCatalogSearchResults.get(k);

            if (flowsheetCourses.byIds[k] !== undefined) {
              removeSelection(k);
            }

            return {
              id: k,
              name: course ? getCourseDisplayName(course) : 'Unknown',
            };
          })}
        >
          {(item) => (
            <GridListItem id={item.id} textValue={item.name}>
              {item.name}
            </GridListItem>
          )}
        </GridList>
      </Popover>
    </MenuTrigger>
  );
}

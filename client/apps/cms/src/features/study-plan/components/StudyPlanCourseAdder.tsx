import React from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Modal,
  Pill,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { List, Plus, PlusCircle, X } from 'lucide-react';
import { useAddCoursesToStudyPlan } from '@/features/study-plan/hooks/useAddCoursesToStudyPlan.ts';
import { DataTable } from '@/shared/components/DataTable.tsx';
import { DataTablePagination } from '@/shared/components/DataTablePagination.tsx';
import { DataTableSearch } from '@/shared/components/DataTableSearch.tsx';
import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { getSectionDisplayName } from '@/utils/getSectionDisplayName.ts';
import { usePaginatedCourseList } from '@/features/course/hooks/usePaginatedCourseList.ts';
import classes from '@/shared/styles/PillGroupBox.module.css';
import { useCoursesGraph } from '@/contexts/CoursesGraphContext.tsx';
import { CreateCourseModal } from '@/features/course/components/CreateCourseModal';
import { Course, CourseSummary } from '@/features/course/types.ts';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import { EntityNameWithStatus } from '@/shared/components/EntityNameWithStatus.tsx';

type CourseMeta = Pick<CourseSummary, 'code' | 'name'>;

export function StudyPlanCourseAdder() {
  const { data: studyPlan } = useCurrentStudyPlan();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState<string | null>(null);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const DEBOUNCE_MS = 500;
  const [filter, setFilter] = React.useState('');
  const [debouncedFilter] = useDebouncedValue(filter, DEBOUNCE_MS);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [selectedCourses, setSelectedCourses] = React.useState<Record<string, CourseMeta>>({});
  const { coursesGraph } = useCoursesGraph();
  const addCourses = useAddCoursesToStudyPlan();

  const { data, isFetching } = usePaginatedCourseList({
    filter: debouncedFilter,
    page: pagination.pageIndex,
    size: pagination.pageSize,
    columnFilters: []
  });

  const columnHelper = createColumnHelper<CourseSummary>();
  const columns = React.useMemo<ColumnDef<CourseSummary>[]>(
    () => [
      columnHelper.display({
        id: 'selection',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected() || coursesGraph.has(row.original.id)}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      }),

      columnHelper.accessor('code', {
        header: 'Code',
        cell: ({ row }) => <Badge variant="default">{row.original.code}</Badge>,
      }) as ColumnDef<CourseSummary>,

      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <EntityNameWithStatus entity={row.original} entityType="course" size="sm" />
        ),
      }) as ColumnDef<CourseSummary>,
      columnHelper.accessor('creditHours', {
        header: 'Cr.',
        cell: ({ row }) => <p style={{ textWrap: 'nowrap' }}>{row.original.creditHours} Cr.</p>,
      }) as ColumnDef<CourseSummary>,
    ],
    []
  );

  const table = useReactTable<CourseSummary>({
    data: data?.content ?? [],
    columns,
    state: {
      globalFilter: debouncedFilter,
      pagination,
      rowSelection: rowSelection,
    },

    enableRowSelection: (row) => !coursesGraph.has(row.original.id),
    getRowId: (row) => String(row.id),
    onRowSelectionChange: (updaterOrValue) => {
      setRowSelection((prevSel) => {
        const newSel =
          typeof updaterOrValue === 'function' ? updaterOrValue(prevSel) : updaterOrValue;

        setSelectedCourses((prevMap) => {
          const nextMap: Record<string, CourseMeta> = Object.fromEntries(
            Object.entries(prevMap).filter(([id]) => newSel[id])
          );
          data?.content.forEach((c) => {
            const key = String(c.id);
            if (newSel[key] && !nextMap[key]) {
              nextMap[key] = { code: c.code, name: c.name };
            }
          });
          return nextMap;
        });

        return newSel;
      });
    },
    onGlobalFilterChange: setFilter,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualFiltering: true,
    pageCount: data?.totalPages ?? 1,
    rowCount: data?.totalCourses,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleAddCourse = () => {
    if (!selectedSection) return;
    addCourses.mutate(
      {
        studyPlanId: studyPlan.id,
        sectionId: Number(selectedSection),
        courseIds: Object.keys(rowSelection).map(Number),
      },
      {
        onSuccess: () => {
          setModalOpen(false);
          setSelectedCourses({});
          setRowSelection({});
          setFilter('');
          setSelectedSection(null);
        },
      }
    );
  };

  const handleRemoveCourse = (id: string) => {
    table.setRowSelection((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const sectionOptions = React.useMemo(
    () =>
      studyPlan.sections.map((s) => ({
        value: s.id.toString(),
        label: getSectionDisplayName(s),
      })),
    [studyPlan]
  );

  const noSelection = Object.keys(selectedCourses).length === 0;

  const selectCreatedCourse = (course: Course) => {
    setFilter('');

    const courseId = String(course.id);

    setRowSelection((prev) => ({
      ...prev,
      [courseId]: true,
    }));

    setSelectedCourses((prev) => ({
      ...prev,
      [courseId]: {
        code: course.code,
        name: course.name,
      },
    }));
  };

  return (
    <>
      <CreateCourseModal
        selectCreatedCourse={selectCreatedCourse}
        opened={createModalOpen}
        setOpened={setCreateModalOpen}
        openCourseSearch={() => setModalOpen(true)}
      />
      <Button onClick={() => setModalOpen(true)} leftSection={<Plus size={16} />}>
        Add Courses
      </Button>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <div>
            <Title order={4} fw={600} lh="md">
              Add Courses to Study Plan
            </Title>
            <Text size="xs" c="dimmed">
              Select courses from the catalog and add them to a section
            </Text>
          </div>
        }
        size="xl"
        centered
      >
        <Stack>
          <Group>
            <DataTableSearch
              table={table}
              placeholder="Filter courses..."
              debounce={DEBOUNCE_MS}
              loading={isFetching}
            />

            <Button
              variant="white"
              leftSection={<Plus size={16} />}
              onClick={() => {
                setModalOpen(false);
                setCreateModalOpen(true);
              }}
            >
              Create New Course
            </Button>
          </Group>

          <DataTable table={table} />

          <DataTablePagination table={table} />

          <Divider />

          <Box className={classes.box}>
            <Pill.Group style={{ alignContent: 'start' }}>
              {Object.entries(selectedCourses).map(([id, metadata]) => {
                return (
                  <Pill key={id} withRemoveButton onRemove={() => handleRemoveCourse(id)}>
                    {metadata.code}: {metadata.name}
                  </Pill>
                );
              })}
            </Pill.Group>
            {noSelection && (
              <Group gap="xs" m="auto">
                <PlusCircle color="gray" size={16} />
                <Text c="dimmed" size="sm">
                  Selected courses will appear here
                </Text>
              </Group>
            )}
          </Box>

          <Group>
            <Button
              variant="default"
              leftSection={<X size={16} />}
              disabled={noSelection}
              onClick={() => {
                setRowSelection({});
                setSelectedCourses({});
              }}
            >
              Clear {!noSelection && `(${Object.keys(selectedCourses).length})`}
            </Button>

            <Select
              flex={1}
              leftSection={<List size={16} />}
              placeholder="Select section"
              searchable
              clearable
              data={sectionOptions}
              value={selectedSection}
              onChange={setSelectedSection}
            />

            <Button
              leftSection={<Plus size={16} />}
              onClick={handleAddCourse}
              loading={addCourses.isPending}
              disabled={!Object.keys(rowSelection).length || !selectedSection}
            >
              Add to Study Plan
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

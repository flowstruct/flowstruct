import { usePaginatedCourseList } from '@/features/course/hooks/usePaginatedCourseList.ts';
import { useDataTable } from '@/shared/hooks/useDataTable.ts';
import { CourseSummary } from '@/features/course/types.ts';
import React from 'react';
import { getCoursesTableColumns } from '@/features/course/components/CoursesTableColumns.tsx';
import { DataTable } from '@/shared/components/DataTable.tsx';
import { Button, Group, LoadingOverlay, Stack } from '@mantine/core';
import { DataTablePagination } from '@/shared/components/DataTablePagination.tsx';
import { DataTableSearch } from '@/shared/components/DataTableSearch.tsx';
import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTableSearch } from '@/shared/hooks/useTableSearch.ts';
import { OutdatedFilter } from '@/shared/components/OutdatedFilter.tsx';

export function CoursesTable() {
  const columns = React.useMemo(() => getCoursesTableColumns(), []);

  const search = useTableSearch();
  const { data: coursesPage, isPending, isFetching } = usePaginatedCourseList(search);

  const data: CourseSummary[] = React.useMemo(
    () => coursesPage?.content ?? [],
    [coursesPage?.content]
  );

  const table = useDataTable<CourseSummary>({
    data,
    columns,
    search,
    manualPagination: true,
    manualFiltering: true,
    pageCount: coursesPage?.totalPages,
    rowCount: coursesPage?.totalCourses,
  });

  return (
    <Stack>
      <Group>
        <OutdatedFilter table={table} />

        <DataTableSearch
          width=""
          placeholder="Search any course..."
          table={table}
          debounce={750}
          loading={isFetching}
        />

        <Link to="/catalog/courses/new">
          <Button leftSection={<Plus size={18} />}>Create New Course</Button>
        </Link>
      </Group>

      <LoadingOverlay visible={isPending} zIndex={1000} loaderProps={{ type: 'bars' }} />

      <DataTable table={table} />

      <DataTablePagination table={table} />
    </Stack>
  );
}

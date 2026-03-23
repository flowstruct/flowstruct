import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Header, HeaderActions, HeaderMain } from '@/shared/components/header';
import { courseQueries } from '@/features/course/queries';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useCourseTable } from '@/features/course/hooks/use-course-table';
import { DataTableToolbar } from '@/shared/components/data-table/data-table-toolbar';
import { Tabs } from '@/shared/components/ui/tabs';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { CourseStatus } from '@/features/course/domain/getCourseStatusFilter';
import { TabOption } from '@/shared/types';
import { CircleDashed, CircleDot, Folder, Layers2, Plus, BookOpen, PlusSquare } from 'lucide-react';
import { CourseFormFields } from '@/features/course/components/course-form-fields';
import {
  FormModal,
  FormModalBody,
  FormModalContent,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
  FormModalTrigger,
} from '@/shared/components/form-modal';
import { Button } from '@/shared/components/ui/Button';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { courseApi } from '@/features/course/api';
import { Course } from '@/features/course/domain/course';
import { courseKeys } from '@/features/course/queries';
import { Scrollable } from '@/shared/components/scrollable';
import { useDebounce } from '@/shared/hooks/use-debounce';

export const Route = createFileRoute('/_app/courses/')({
  loaderDeps: ({ search: { filter, page, size, tab } }) => ({
    search: { filter, page, size, tab },
  }),
  loader: ({ context: { queryClient }, deps }) => {
    queryClient.ensureQueryData(
      courseQueries.page({
        page: deps.search.page,
        filter: deps.search.filter,
        size: deps.search.size,
        status: deps.search.tab,
      })
    );
  },
  component: CoursesPage,
});

function CoursesPage() {
  const { tab, filter, page, size } = Route.useSearch();
  const { data: coursesPage, isFetching } = useQuery(
    courseQueries.page({
      filter,
      page,
      size,
      status: tab,
    })
  );
  const showSkeleton = useDebounce(isFetching, 350);
  const searchOptions = { filter, page, size };
  const table = useCourseTable({
    courses: coursesPage?.content ?? [],
    pageCount: coursesPage?.totalPages,
    rowCount: coursesPage?.totalCourses,
    searchOptions,
  });

  return (
    <>
      <Header>
        <HeaderMain>
          <RouteTabs />
        </HeaderMain>

        <HeaderActions>
          <DataTableToolbar enableSearch table={table} isLoading={isFetching && filter !== ''} />
          <CreateCourseModal />
        </HeaderActions>
      </Header>

      <Scrollable>
        <DataTable table={table} isLoading={showSkeleton} />
      </Scrollable>
    </>
  );
}

function RouteTabs() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  const tabs: TabOption<CourseStatus>[] = [
    { value: 'all', label: 'All courses', icon: <Layers2 size={14} /> },
    { value: 'active', label: 'Active', icon: <CircleDot size={14} /> },
    { value: 'outdated', label: 'Outdated', icon: <CircleDashed size={14} /> },
  ];

  return (
    <Tabs
      tabs={tabs}
      currentTab={tab}
      onTabChange={(next) => navigate({ to: '.', search: { tab: next } })}
    />
  );
}

function CreateCourseModal() {
  const { tab, filter, page, size } = Route.useSearch();
  const queryClient = useQueryClient();
  const createCourse = useMutation({
    mutationFn: courseApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.page({ filter, page, size, status: tab }),
      });
    },
    meta: { successMessage: 'Course created.' },
  });

  return (
    <FormModal size="md" onSubmit={(data) => createCourse.mutate(data as Partial<Course>)}>
      <FormModalTrigger>
        <Button size="sm" variant="transparent">
          <Plus size={15} />
        </Button>
      </FormModalTrigger>

      <FormModalBody>
        <FormModalHeader>
          <Breadcrumbs>
            <Breadcrumb base>
              <Folder size={15} /> Courses
            </Breadcrumb>

            <Breadcrumb>
              <PlusSquare size={15} color="teal" /> New course
            </Breadcrumb>
          </Breadcrumbs>
        </FormModalHeader>

        <FormModalContent>
          <CourseFormFields />
        </FormModalContent>

        <FormModalFooter>
          <FormModalSubmit isPending={createCourse.isPending}>
            <BookOpen size={15} /> Create
          </FormModalSubmit>
        </FormModalFooter>
      </FormModalBody>
    </FormModal>
  );
}

import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { CoursesSearch } from '@/features/course/domain/course';
import { CourseStatus } from '@/features/course/domain/getCourseStatusFilter';

const defaultSearch: CoursesSearch = {
  tab: 'active',
  filter: '',
  page: 0,
  size: 10,
};

export const Route = createFileRoute('/_app/courses')({
  validateSearch: (search): CoursesSearch => ({
    tab: (search.tab as CourseStatus) || defaultSearch.tab,
    filter: (search.filter as string) ?? defaultSearch.filter,
    page: (search.page as number) ?? defaultSearch.page,
    size: (search.size as number) ?? defaultSearch.size,
  }),
  search: {
    middlewares: [stripSearchParams<CoursesSearch>(defaultSearch)],
  },
});

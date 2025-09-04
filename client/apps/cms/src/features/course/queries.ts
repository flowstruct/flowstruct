import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { COURSE_ENDPOINT } from '@/features/course/constants.ts';
import { TableSearchOptions } from '@/shared/types.ts';
import { api } from '@/shared/api.ts';
import { Course, CoursesPage } from '@/features/course/types.ts';
import { transformCourseSearchOptions } from '@/utils/transformCourseSearchOptions.ts';

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (options: TableSearchOptions) => [...courseKeys.lists(), options] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
};

export const CourseQuery = (courseId: number) =>
  queryOptions({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => api.get<Course>([COURSE_ENDPOINT, courseId]),
  });

export const PaginatedCourseListQuery = (options: TableSearchOptions) =>
  queryOptions({
    queryKey: courseKeys.list(options),
    queryFn: () =>
      api.get<CoursesPage>(COURSE_ENDPOINT, {
        params: transformCourseSearchOptions(options),
      }),
    placeholderData: keepPreviousData,
  });

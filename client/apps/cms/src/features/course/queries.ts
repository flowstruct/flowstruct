import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { courseApi } from '@/features/course/api.ts';
import { TableSearchOptions } from '@/shared/types.ts';

export const courseKeys = {
  all: ['courses'] as const,
  pages: () => [...courseKeys.all, 'page'] as const,
  page: (options: TableSearchOptions) => [...courseKeys.pages(), options] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
};

export const courseQueries = {
  detail: (courseId: number) =>
    queryOptions({
      queryKey: courseKeys.detail(courseId),
      queryFn: () => courseApi.getCourse(courseId),
    }),

  page: (options: TableSearchOptions) =>
    queryOptions({
      queryKey: courseKeys.page(options),
      queryFn: () => courseApi.getPaginatedCourses(options),
      placeholderData: keepPreviousData,
    }),
};

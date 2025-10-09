import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import { courseApi } from '@/features/course/api.ts';
import { SearchOptions } from '@/shared/types.ts';

export const courseKeys = {
  all: ['courses'] as const,
  pages: () => [...courseKeys.all, 'page'] as const,
  page: (options: SearchOptions) => [...courseKeys.pages(), options] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
  infinites: () => [...courseKeys.all, 'infinite'] as const,
  infinite: (options: SearchOptions) => [...courseKeys.infinites(), options] as const,
};

export const courseQueries = {
  detail: (courseId: number) =>
    queryOptions({
      queryKey: courseKeys.detail(courseId),
      queryFn: () => courseApi.getCourse(courseId),
    }),

  page: (options: SearchOptions) =>
    queryOptions({
      queryKey: courseKeys.page(options),
      queryFn: () => courseApi.getPaginatedCourses(options),
      placeholderData: keepPreviousData,
    }),

  infinite: (options: SearchOptions) =>
    infiniteQueryOptions({
      queryKey: courseKeys.infinite(options),
      queryFn: ({ pageParam }) =>
        courseApi.getPaginatedCourses({ filter: options.filter, page: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPage.isLastPage ? null : lastPageParam + 1,
    }),
};

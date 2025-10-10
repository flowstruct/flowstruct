import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import { courseApi } from '@/features/course/api.ts';
import { SearchOptions } from '@/shared/types.ts';

export const courseKeys = {
  all: ['courses'] as const,
  pages: () => [...courseKeys.all, 'page'] as const,
  page: (options: SearchOptions) => [...courseKeys.pages(), options] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
  catalogs: () => [...courseKeys.all, 'catalog'] as const,
  catalog: (options: SearchOptions) => [...courseKeys.catalogs(), options] as const,
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

  catalog: (options: SearchOptions) =>
    infiniteQueryOptions({
      queryKey: courseKeys.catalog(options),
      queryFn: ({ pageParam }) =>
        courseApi.getPaginatedCourses({ filter: options.filter, page: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPage.isLastPage ? null : lastPageParam + 1,
      placeholderData: keepPreviousData,
    }),
};

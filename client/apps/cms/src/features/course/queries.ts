import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import { courseApi } from '@/features/course/api';
import { SearchOptions } from '@/shared/types';

type CoursePageOptions = SearchOptions & {
  status?: 'all' | 'active' | 'outdated';
};

export const courseKeys = {
  all: ['courses'] as const,
  pages: () => [...courseKeys.all, 'page'] as const,
  page: (options: CoursePageOptions) => [...courseKeys.pages(), options] as const,
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

  page: (options: CoursePageOptions) =>
    queryOptions({
      queryKey: courseKeys.page(options),
      queryFn: () =>
        courseApi.getPaginatedCourses({
          filter: options.filter,
          page: options.page,
          size: options.size,
          status: options.status ?? 'all',
        }),
      placeholderData: keepPreviousData,
    }),

  catalog: (options: SearchOptions) =>
    infiniteQueryOptions({
      queryKey: courseKeys.catalog(options),
      queryFn: ({ pageParam }) =>
        courseApi.getPaginatedCourses({
          filter: options.filter,
          page: pageParam,
          size: 10,
          status: 'all',
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPage.isLastPage ? null : lastPageParam + 1,
      placeholderData: keepPreviousData,
      select: (data) => ({ results: data.pages.flatMap((p) => p.content) ?? [] }),
    }),
};

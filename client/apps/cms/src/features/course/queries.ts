import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import { courseApi } from '@/features/course/api.ts';
import { FilterSearchParams } from '@/shared/types.ts';

export const courseKeys = {
  all: ['courses'] as const,
  pages: () => [...courseKeys.all, 'page'] as const,
  page: (params: FilterSearchParams) => [...courseKeys.pages(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
  infinites: () => [...courseKeys.all, 'infinite'] as const,
  infinite: (params: Partial<FilterSearchParams>) => [...courseKeys.infinites(), params] as const,
};

export const courseQueries = {
  detail: (courseId: number) =>
    queryOptions({
      queryKey: courseKeys.detail(courseId),
      queryFn: () => courseApi.getCourse(courseId),
    }),

  page: (params: FilterSearchParams) =>
    queryOptions({
      queryKey: courseKeys.page(params),
      queryFn: () => courseApi.getPaginatedCourses(params),
      placeholderData: keepPreviousData,
    }),

  infinite: (params: Partial<FilterSearchParams>) =>
    infiniteQueryOptions({
      queryKey: courseKeys.infinite(params),
      queryFn: () => courseApi.getPaginatedCourses(params),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPage.isLastPage ? null : lastPageParam + 1,
    }),
};

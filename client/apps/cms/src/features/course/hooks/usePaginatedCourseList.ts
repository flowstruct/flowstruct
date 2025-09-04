import { useQuery } from '@tanstack/react-query';
import { PaginatedCourseListQuery } from '@/features/course/queries.ts';
import { TableSearchOptions } from '@/shared/types.ts';

export const usePaginatedCourseList = (options: TableSearchOptions) => {
  return useQuery(PaginatedCourseListQuery(options));
};

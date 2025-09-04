import { TableSearchOptions } from '@/shared/types.ts';

export const transformCourseSearchOptions = (options: TableSearchOptions) => {
  const { filter, page, size, columnFilters } = options;

  const outdatedFilter = columnFilters.find((cf) => cf.id === 'outdatedAt');

  return {
    filter,
    page,
    size,
    status: outdatedFilter?.value ?? 'all',
  };
};

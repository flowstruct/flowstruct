import { FilterSearchParams } from '@/shared/types.ts';

export const transformCourseSearchParams = (options: Partial<FilterSearchParams>) => {
  const { filter, page, size, columnFilters } = options;

  const outdatedFilter = columnFilters.find((cf) => cf.id === 'outdatedAt');

  return {
    filter,
    page,
    size,
    status: outdatedFilter?.value ?? 'all',
  };
};

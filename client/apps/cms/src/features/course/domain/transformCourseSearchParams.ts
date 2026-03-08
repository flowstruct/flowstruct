import { SearchOptions } from '@/shared/types';

export const transformCourseSearchParams = ({
  filter = '',
  page = 0,
  size = 10,
  columnFilters = [],
}: SearchOptions) => {
  const outdatedFilter = columnFilters?.find((cf) => cf.id === 'outdatedAt');

  return {
    filter,
    page,
    size,
    archiveStatus: outdatedFilter?.value ?? 'all',
  };
};

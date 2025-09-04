import { TableSearchOptions } from '@/shared/types.ts';

export const DefaultFrameworkCoursesSearchValues = (): TableSearchOptions => ({
  filter: '',
  page: 0,
  size: 7,
  columnFilters: [],
});

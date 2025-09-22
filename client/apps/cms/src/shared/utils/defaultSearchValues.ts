import { TableSearchOptions } from '@/shared/types.ts';

export const DefaultSearchValues = (): TableSearchOptions => ({
  filter: '',
  page: 0,
  size: 10,
  columnFilters: [],
});
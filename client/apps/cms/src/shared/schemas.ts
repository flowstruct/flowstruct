import { z } from 'zod/v4';
import { TableSearchOptions } from '@/shared/types.ts';

export const getTableSearchSchema = (defaultSearchValues: TableSearchOptions) => {
  return z.object({
    filter: z.string().catch(defaultSearchValues.filter),
    page: z.number().catch(defaultSearchValues.page),
    size: z.number().catch(defaultSearchValues.size),
    columnFilters: z
      .array(
        z.object({
          id: z.string(),
          value: z.unknown(),
        })
      )
      .catch(defaultSearchValues.columnFilters),
  });
};

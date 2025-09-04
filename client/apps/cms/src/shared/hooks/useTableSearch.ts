import { getTableSearchSchema } from '@/shared/schemas.ts';
import { useSearch } from '@tanstack/react-router';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';

export const useTableSearch = () => {
  const rawSearch = useSearch({ strict: false });

  const searchSchema = getTableSearchSchema(DefaultSearchValues());
  const parsed = searchSchema.safeParse(rawSearch);

  if (!parsed.success) {
    throw new Error('useTableSearch hook must be used in a route with a table search schema');
  }

  return parsed.data;
};

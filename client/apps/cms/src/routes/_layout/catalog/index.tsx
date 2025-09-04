import { createFileRoute, Navigate } from '@tanstack/react-router';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';

export const Route = createFileRoute('/_layout/catalog/')({
  component: () => <Navigate to="/catalog/programs" search={DefaultSearchValues()} />,
});

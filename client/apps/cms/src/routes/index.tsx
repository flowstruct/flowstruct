import { createFileRoute, Navigate } from '@tanstack/react-router';
import { DefaultSearchValues } from '@/shared/utils/defaultSearchValues.ts';

export const Route = createFileRoute('/')({
  component: () => <Navigate to="/flowsheets" search={DefaultSearchValues()} />,
});

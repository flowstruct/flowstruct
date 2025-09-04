import { createFileRoute, Navigate } from '@tanstack/react-router';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';

export const Route = createFileRoute('/')({
  component: () => <Navigate to="/study-plans" search={DefaultSearchValues()} />,
});

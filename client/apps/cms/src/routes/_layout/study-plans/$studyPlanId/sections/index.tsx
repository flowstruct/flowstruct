import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { getTableSearchSchema } from '@/shared/schemas.ts';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { SectionsTable } from '@/features/study-plan/components/SectionsTable.tsx';

export const Route = createFileRoute(
  '/_layout/study-plans/$studyPlanId/sections/',
)({
  component: RouteComponent,
  validateSearch: getTableSearchSchema(DefaultSearchValues()),
  search: {
    middlewares: [stripSearchParams(DefaultSearchValues())],
  },
});

function RouteComponent() {
  return <SectionsTable />;
}

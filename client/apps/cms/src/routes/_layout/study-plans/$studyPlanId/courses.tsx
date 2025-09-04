import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { StudyPlanCoursesTable } from '@/features/study-plan/components/StudyPlanCoursesTable.tsx';
import { DefaultFrameworkCoursesSearchValues } from '@/utils/defaultFrameworkCoursesSearchValues.ts';
import { getTableSearchSchema } from '@/shared/schemas.ts';

export const Route = createFileRoute('/_layout/study-plans/$studyPlanId/courses')({
  component: RouteComponent,
  validateSearch: getTableSearchSchema(DefaultFrameworkCoursesSearchValues()),
  search: {
    middlewares: [stripSearchParams(DefaultFrameworkCoursesSearchValues())],
  },
});

function RouteComponent() {
  return <StudyPlanCoursesTable />;
}

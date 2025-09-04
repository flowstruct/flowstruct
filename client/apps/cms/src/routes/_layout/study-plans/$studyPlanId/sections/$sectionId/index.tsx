import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/study-plans/$studyPlanId/sections/$sectionId/')({
  beforeLoad: ({ params: { studyPlanId, sectionId } }) =>
    redirect({
      to: '/study-plans/$studyPlanId/sections/$sectionId/edit',
      params: { studyPlanId, sectionId },
    }),
});

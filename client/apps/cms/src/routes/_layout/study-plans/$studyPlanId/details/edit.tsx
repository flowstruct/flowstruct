import { createFileRoute } from '@tanstack/react-router';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import { EditStudyPlanDetailsFieldset } from '@/features/study-plan/components/EditStudyPlanDetailsFieldset.tsx';

export const Route = createFileRoute('/_layout/study-plans/$studyPlanId/details/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: studyPlan } = useCurrentStudyPlan();
  return <EditStudyPlanDetailsFieldset studyPlan={studyPlan} />;
}

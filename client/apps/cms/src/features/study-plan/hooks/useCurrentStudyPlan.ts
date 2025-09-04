import { useSuspenseQuery } from '@tanstack/react-query';
import { StudyPlanQuery } from '@/features/study-plan/queries.ts';
import { useParamId } from '@/shared/hooks/useParamId.ts';

export const useCurrentStudyPlan = (fallbackStudyPlanId?: number) => {
  const studyPlanId = useParamId({ paramKey: 'studyPlanId', fallback: fallbackStudyPlanId });
  return useSuspenseQuery(StudyPlanQuery(studyPlanId));
};

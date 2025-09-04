import { useSuspenseQuery } from '@tanstack/react-query';
import { StudyPlanCourseListQuery } from '@/features/study-plan/queries.ts';
import { useParamId } from '@/shared/hooks/useParamId.ts';

export const useCurrentStudyPlanCourses = (fallbackStudyPlanId?: number) => {
  const studyPlanId = useParamId({ paramKey: 'studyPlanId', fallback: fallbackStudyPlanId });
  return useSuspenseQuery(StudyPlanCourseListQuery(studyPlanId));
};

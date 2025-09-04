import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';

const deleteStudyPlan = (studyPlanId: number) =>
  api.delete([STUDY_PLAN_ENDPOINT, studyPlanId]);

export const useDeleteStudyPlan = () =>
  useAppMutation({
    mutationFn: deleteStudyPlan,
    meta: {
      removes: (_, studyPlanId) => [studyPlanKeys.detail(studyPlanId)],
      invalidates: [studyPlanKeys.list()],
      successMessage: 'Deleted study plan.',
    },
  });

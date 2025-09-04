import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';

const unarchiveStudyPlan = (studyPlanId: number) =>
  api.put<void>([STUDY_PLAN_ENDPOINT, studyPlanId, 'unarchive']);

export const useUnarchiveStudyPlan = () =>
  useAppMutation({
    mutationFn: unarchiveStudyPlan,
    meta: {
      invalidates: (_, studyPlanId) => [studyPlanKeys.list(), studyPlanKeys.detail(studyPlanId)],
      successMessage: 'Study plan unarchived.',
    },
  });

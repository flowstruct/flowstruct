import { StudyPlan } from '@/features/study-plan/types.ts';
import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { api } from '@/shared/api.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';

const discardStudyPlanChanges = async (studyPlanId: number) =>
  api.put<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'discard-changes']);

export const useDiscardStudyPlanChanges = () =>
  useAppMutation({
    mutationFn: discardStudyPlanChanges,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: (data) => [studyPlanKeys.list(), studyPlanKeys.courseList(data.id)],
      successMessage: 'Discarded study plan changes.',
    },
  });

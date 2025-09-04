import { api } from '@/shared/api.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';
import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';

const approveStudyPlan = (studyPlanId: number) =>
  api.put<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'approve-changes']);

export const useApproveStudyPlanChanges = () =>
  useAppMutation({
    mutationFn: approveStudyPlan,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
      successMessage: 'Study plan changes approved.',
    },
  });

import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';
import { api } from '@/shared/api.ts';

const editStudyPlanDetails = ({
  studyPlanId,
  studyPlanDetails,
}: {
  studyPlanId: number;
  studyPlanDetails: Partial<StudyPlan>;
}) => api.put<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId], { body: studyPlanDetails });

export const useEditStudyPlanDetails = () =>
  useAppMutation({
    mutationFn: editStudyPlanDetails,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
      successMessage: 'Study plan details updated.',
    },
  });

import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';
import { api } from '@/shared/api.ts';

export const createStudyPlan = ({ studyPlanDetails }: { studyPlanDetails: Partial<StudyPlan> }) =>
  api.post<StudyPlan>(STUDY_PLAN_ENDPOINT, {
    body: studyPlanDetails,
  });

export const useCreateStudyPlan = () =>
  useAppMutation({
    mutationFn: createStudyPlan,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
      successMessage: 'Created study plan.',
    },
  });

import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';
import { api } from '@/shared/api.ts';

const cloneStudyPlan = ({
  studyPlanToCloneId,
  cloneDetails,
}: {
  studyPlanToCloneId: number;
  cloneDetails: Partial<StudyPlan>;
}) =>
  api.post<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanToCloneId, 'clone'], {
    body: cloneDetails,
  });

export const useCloneStudyPlan = () =>
  useAppMutation({
    mutationFn: cloneStudyPlan,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
      successMessage: 'Study plan cloned.',
    },
  });

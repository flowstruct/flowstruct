import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { api } from '@/shared/api.ts';
import { Section, StudyPlan } from '@/features/study-plan/types.ts';
import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';

export const createSection = ({
  studyPlanId,
  sectionDetails,
}: {
  studyPlanId: number;
  sectionDetails: Partial<Section>;
}) =>
  api.post<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'sections'], {
    body: sectionDetails,
  });

export const useCreateSection = () =>
  useAppMutation({
    mutationFn: createSection,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
      successMessage: 'Created section.',
    },
  });

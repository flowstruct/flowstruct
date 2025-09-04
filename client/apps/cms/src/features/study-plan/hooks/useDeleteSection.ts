import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';

const deleteSection = ({ studyPlanId, sectionId }: { studyPlanId: number; sectionId: number }) =>
  api.delete<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'sections', sectionId]);

export const useDeleteSection = () =>
  useAppMutation({
    mutationFn: deleteSection,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
    },
  });

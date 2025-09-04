import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { MoveDirection, StudyPlan } from '@/features/study-plan/types.ts';
import { api } from '@/shared/api.ts';

const moveSection = ({
  studyPlanId,
  sectionId,
  direction,
}: {
  studyPlanId: number;
  sectionId: number;
  direction: MoveDirection;
}) =>
  api.put<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'sections', sectionId, 'move'], {
    params: { direction },
  });

export const useMoveSection = () =>
  useAppMutation({
    mutationFn: moveSection,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
    },
  });

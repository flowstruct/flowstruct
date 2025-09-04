import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { api } from '@/shared/api.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';

const resizeCoursePlacement = ({
  studyPlanId,
  courseId,
  span,
}: {
  studyPlanId: number;
  courseId: number;
  span: number;
}) =>
  api.put<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'course-placements', courseId, 'resize'], {
    params: {
      span,
    },
  });

export const useResizeCoursePlacement = () => {
  return useAppMutation({
    mutationFn: resizeCoursePlacement,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
    },
  });
};

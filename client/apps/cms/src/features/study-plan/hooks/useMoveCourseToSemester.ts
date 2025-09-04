import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { CoursePlacement, StudyPlan } from '@/features/study-plan/types.ts';
import { api } from '@/shared/api.ts';

const moveCourseToSemester = ({
  studyPlanId,
  courseId,
  targetPlacement,
}: {
  studyPlanId: number;
  courseId: number;
  targetPlacement: CoursePlacement;
}) =>
  api.put<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'course-placements', courseId], {
    body: targetPlacement,
  });

export const useMoveCourseToSemester = () =>
  useAppMutation({
    mutationFn: moveCourseToSemester,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
    },
  });

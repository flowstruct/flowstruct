import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { CoursePlacement, StudyPlan } from '@/features/study-plan/types.ts';
import { api } from '@/shared/api.ts';

const placeCoursesInSemester = ({
  studyPlanId,
  targetPlacement,
  courseIds,
}: {
  studyPlanId: number;
  targetPlacement: CoursePlacement;
  courseIds: number[];
}) =>
  api.post<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'course-placements'], {
    params: { courses: courseIds },
    body: targetPlacement,
  });

export const usePlaceCoursesInSemester = () => {
  return useAppMutation({
    mutationFn: placeCoursesInSemester,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
    },
  });
};

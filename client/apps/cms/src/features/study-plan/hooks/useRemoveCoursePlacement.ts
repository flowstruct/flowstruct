import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';

const removeCourseFromSemester = ({
  studyPlanId,
  courseId,
}: {
  studyPlanId: number;
  courseId: number;
}) => api.delete<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'course-placements', courseId]);

export const useRemoveCoursePlacement = () =>
  useAppMutation({
    mutationFn: removeCourseFromSemester,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
    },
  });

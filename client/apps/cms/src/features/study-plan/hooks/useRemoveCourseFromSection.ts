import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';

const removeCoursesFromStudyPlan = ({
  courseIds,
  studyPlanId,
}: {
  courseIds: number[];
  studyPlanId: number;
}) =>
  api.delete<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'courses'], {
    params: {
      courses: courseIds,
    },
  });

export const useRemoveCoursesFromStudyPlan = () =>
  useAppMutation({
    mutationFn: removeCoursesFromStudyPlan,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: (data) => [studyPlanKeys.list(), studyPlanKeys.courseList(data.id)],
      successMessage: (_, { courseIds }) =>
        `${courseIds.length} course(s) removed from study plan.`,
    },
  });

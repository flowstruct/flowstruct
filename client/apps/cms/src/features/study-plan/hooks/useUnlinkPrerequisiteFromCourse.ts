import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';

const unlinkPrerequisiteFromCourse = ({
  studyPlanId,
  courseId,
  prerequisiteId,
}: {
  studyPlanId: number;
  courseId: number;
  prerequisiteId: number;
}) =>
  api.delete<StudyPlan>([
    STUDY_PLAN_ENDPOINT,
    studyPlanId,
    'courses',
    courseId,
    'prerequisites',
    prerequisiteId,
  ]);

export const useUnlinkPrerequisiteFromCourse = () =>
  useAppMutation({
    mutationFn: unlinkPrerequisiteFromCourse,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
    },
  });

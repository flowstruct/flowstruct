import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';

const linkCorequisitesToCourse = ({
  studyPlanId,
  courseId,
  corequisiteIds,
}: {
  studyPlanId: number;
  courseId: number;
  corequisiteIds: number[];
}) =>
  api.post<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'courses', courseId, 'corequisites'], {
    params: {
      courses: corequisiteIds,
    },
  });

export const useLinkCorequisitesToCourse = () =>
  useAppMutation({
    mutationFn: linkCorequisitesToCourse,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
    },
  });

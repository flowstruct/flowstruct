import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { CourseRelation, StudyPlan } from '@/features/study-plan/types.ts';
import { api } from '@/shared/api.ts';

const linkPrerequisitesToCourse = ({
  studyPlanId,
  courseId,
  prerequisites,
  relation,
}: {
  studyPlanId: number;
  courseId: number;
  prerequisites: number[];
  relation: CourseRelation;
}) =>
  api.post<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'courses', courseId, 'prerequisites'], {
    params: {
      prerequisites,
      relation,
    },
  });

export const useLinkPrerequisitesToCourse = () =>
  useAppMutation({
    mutationFn: linkPrerequisitesToCourse,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: [studyPlanKeys.list()],
    },
  });

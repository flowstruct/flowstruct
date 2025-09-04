import { STUDY_PLAN_ENDPOINT } from '@/features/study-plan/constants.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { StudyPlan } from '@/features/study-plan/types.ts';

const addCoursesToStudyPlan = ({
  courseIds,
  sectionId,
  studyPlanId,
}: {
  courseIds: number[];
  sectionId: number;
  studyPlanId: number;
}) =>
  api.post<StudyPlan>([STUDY_PLAN_ENDPOINT, studyPlanId, 'courses'], {
    params: {
      courses: courseIds,
      section: sectionId,
    },
  });

export const useAddCoursesToStudyPlan = () => {
  return useAppMutation({
    mutationFn: addCoursesToStudyPlan,
    meta: {
      setData: (data) => studyPlanKeys.detail(data.id),
      invalidates: (data) => [studyPlanKeys.list(), studyPlanKeys.courseList(data.id)],
      successMessage: 'Course(s) added to study plan.',
    },
  });
};

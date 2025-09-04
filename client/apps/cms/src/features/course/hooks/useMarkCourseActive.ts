import { COURSE_ENDPOINT } from '@/features/course/constants.ts';
import { courseKeys } from '@/features/course/queries.ts';
import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { Course } from '@/features/course/types.ts';

const markCourseActive = (courseId: number) =>
  api.put<Course>([COURSE_ENDPOINT, courseId, 'mark-active']);

export const useMarkCourseActive = () =>
  useAppMutation({
    mutationFn: markCourseActive,
    meta: {
      setData: (data) => courseKeys.detail(data.id),
      invalidates: [courseKeys.lists(), studyPlanKeys.courseLists()],
      successMessage: 'Course marked as active.',
    },
  });

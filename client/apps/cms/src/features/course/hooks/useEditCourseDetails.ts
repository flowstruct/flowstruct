import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { courseKeys } from '@/features/course/queries.ts';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';
import { Course } from '@/features/course/types.ts';
import { api } from '@/shared/api.ts';
import { COURSE_ENDPOINT } from '@/features/course/constants.ts';

const editCourseDetails = async ({
  courseId,
  courseDetails,
}: {
  courseId: number;
  courseDetails: Partial<Course>;
}) =>
  api.put<Course>([COURSE_ENDPOINT, courseId], {
    body: courseDetails,
  });

export const useEditCourseDetails = () =>
  useAppMutation({
    mutationFn: editCourseDetails,
    meta: {
      setData: (data) => courseKeys.detail(data.id),
      invalidates: [courseKeys.lists(), studyPlanKeys.courseLists()],
      successMessage: (data) => `Updated ${data.code} details.`,
    },
  });

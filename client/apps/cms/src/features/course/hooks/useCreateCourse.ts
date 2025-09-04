import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { courseKeys } from '@/features/course/queries.ts';
import { Course } from '@/features/course/types.ts';
import { api } from '@/shared/api.ts';
import { COURSE_ENDPOINT } from '@/features/course/constants.ts';

const createCourse = async (newCourse: Partial<Course>) =>
  api.post<Course>(COURSE_ENDPOINT, {
    body: newCourse,
  });

export const useCreateCourse = () =>
  useAppMutation({
    mutationFn: createCourse,
    meta: {
      setData: (data) => courseKeys.detail(data.id),
      invalidates: [courseKeys.lists()],
      successMessage: (data) => `Course ${data.code} created.`,
    },
  });

import { api } from '@/shared/api.ts';
import { Course, CoursesPage } from '@/features/course/domain/course.ts';
import { transformCourseSearchParams } from '@/features/course/domain/transformCourseSearchParams.ts';
import { SearchOptions } from '@/shared/types.ts';

const COURSE_ENDPOINT = '/courses';

export const courseApi = {
  getCourse: (courseId: number) => api.get<Course>([COURSE_ENDPOINT, courseId]),
  getPaginatedCourses: (options: SearchOptions) =>
    api.get<CoursesPage>(COURSE_ENDPOINT, {
      params: transformCourseSearchParams(options),
    }),
  getCourses: (courseIds: number[]) =>
    api.get<Course[]>([COURSE_ENDPOINT, 'list'], {
      params: {
        courses: courseIds,
      },
    }),
};

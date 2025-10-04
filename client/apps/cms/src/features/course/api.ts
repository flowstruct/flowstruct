import { api } from '@/shared/api.ts';
import { Course, CoursesPage } from '@/features/course/domain/course.ts';
import { transformCourseSearchOptions } from '@/features/course/domain/transformCourseSearchOptions.ts';
import { TableSearchOptions } from '@/shared/types.ts';

const COURSE_ENDPOINT = '/courses';

export const courseApi = {
  getCourse: (courseId: number) => api.get<Course>([COURSE_ENDPOINT, courseId]),
  getPaginatedCourses: (options: TableSearchOptions) =>
    api.get<CoursesPage>(COURSE_ENDPOINT, {
      params: transformCourseSearchOptions(options),
    }),
  getCourses: (courseIds: number[]) =>
    api.get<Course[]>([COURSE_ENDPOINT, 'list'], {
      params: {
        courses: courseIds,
      },
    }),
};

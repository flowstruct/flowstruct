import { api } from '@/shared/api';
import { Course, CoursesPage } from '@/features/course/domain/course';
import { transformCourseSearchParams } from '@/features/course/domain/transformCourseSearchParams';
import { SearchOptions } from '@/shared/types';

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
  createCourse: (details: Partial<Course>) =>
    api.post<Course>([COURSE_ENDPOINT], { body: details }),
};

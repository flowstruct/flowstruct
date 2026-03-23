import { api } from '@/shared/api';
import { Course, CoursesPage } from '@/features/course/domain/course';
import { SearchOptions } from '@/shared/types';

const COURSE_ENDPOINT = '/courses';

type CoursePageOptions = SearchOptions & {
  status?: 'all' | 'active' | 'outdated';
};

export const courseApi = {
  getCourse: (courseId: number) => api.get<Course>([COURSE_ENDPOINT, courseId]),

  getPaginatedCourses: (options: CoursePageOptions) =>
    api.get<CoursesPage>(COURSE_ENDPOINT, {
      params: {
        filter: options.filter,
        page: options.page,
        size: options.size,
        status: options.status,
      },
    }),

  getCourses: (courseIds: number[]) =>
    api.get<Course[]>([COURSE_ENDPOINT, 'list'], {
      params: {
        courses: courseIds,
      },
    }),

  createCourse: (details: Partial<Course>) =>
    api.post<Course>([COURSE_ENDPOINT], { body: details }),

  editCourse: (courseId: number, details: Partial<Course>) =>
    api.put<Course>([COURSE_ENDPOINT, courseId], { body: details }),

  markOutdated: (courseId: number) => api.put<Course>([COURSE_ENDPOINT, courseId, 'mark-outdated']),

  markActive: (courseId: number) => api.put<Course>([COURSE_ENDPOINT, courseId, 'mark-active']),
};

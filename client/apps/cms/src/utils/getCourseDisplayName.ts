import { Course } from '@/features/course/types.ts';

export const getCourseDisplayName = (course: Pick<Course, 'code' | 'name'>) =>
  `${course.code}: ${course.name}`;

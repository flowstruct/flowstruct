import { Course } from '@/features/course/domain/course.ts';

export const getCourseDisplayName = (course: Pick<Course, 'code' | 'name'>) =>
  `${course.code}: ${course.name}`;

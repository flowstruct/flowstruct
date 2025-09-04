import { useQuery } from '@tanstack/react-query';
import { CourseQuery } from '@/features/course/queries.ts';

export const useCourse = (courseId: number) => {
  return useQuery(CourseQuery(courseId));
};

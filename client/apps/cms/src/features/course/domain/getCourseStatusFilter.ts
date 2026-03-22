export type CourseStatus = 'all' | 'active' | 'outdated';

export const getCourseStatusFilter = (status: CourseStatus) => {
  return status === 'all' ? 'all' : status;
};
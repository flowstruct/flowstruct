import { createFileRoute } from '@tanstack/react-router';
import { useCurrentCourse } from '@/features/course/hooks/useCurrentCourse.ts';
import { EditCourseFieldset } from '@/features/course/components/EditCourseFieldset.tsx';

export const Route = createFileRoute('/_layout/catalog/courses/$courseId/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: course } = useCurrentCourse();

  return <EditCourseFieldset course={course} />;
}

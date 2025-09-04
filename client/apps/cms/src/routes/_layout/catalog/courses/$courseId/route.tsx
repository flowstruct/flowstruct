import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PageHeaderWithBack } from '@/shared/components/PageHeaderWithBack.tsx';
import { getCourseDisplayName } from '@/utils/getCourseDisplayName.ts';
import { PageLayout } from '@/shared/components/PageLayout.tsx';
import { CourseQuery } from '@/features/course/queries.ts';
import { useCurrentCourse } from '@/features/course/hooks/useCurrentCourse.ts';
import { LastUpdated } from '@/shared/components/LastUpdated.tsx';
import { Group, Stack } from '@mantine/core';
import { OutdatedAlert } from '@/shared/components/OutdatedAlert.tsx';
import { CourseOptionsMenu } from '@/features/course/components/CourseOptionsMenu.tsx';

export const Route = createFileRoute('/_layout/catalog/courses/$courseId')({
  loader: async ({ context: { queryClient }, params }) => {
    const courseId = Number(params.courseId);
    await queryClient.ensureQueryData(CourseQuery(courseId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: course } = useCurrentCourse();

  return (
    <PageLayout
      header={
        <Stack>
          <OutdatedAlert
            outdatedAt={course.outdatedAt}
            outdatedBy={course.outdatedBy}
            entityType="course"
          />
          <Group gap="lg" justify="space-between">
            <PageHeaderWithBack
              title={getCourseDisplayName(course)}
              linkProps={{ to: '/catalog/courses' }}
            />
            <Group>
              <LastUpdated at={course.updatedAt} by={course.updatedBy} />
              <CourseOptionsMenu course={course} />
            </Group>
          </Group>
        </Stack>
      }
    >
      <Outlet />
    </PageLayout>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { CreateCourseFieldset } from '@/features/course/components/CreateCourseFieldset.tsx';
import { PageHeaderWithBack } from '@/shared/components/PageHeaderWithBack.tsx';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { PageLayout } from '@/shared/components/PageLayout.tsx';

export const Route = createFileRoute('/_layout/catalog/courses/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout
      header={
        <PageHeaderWithBack
          title="Create New Course"
          linkProps={{
            to: '/catalog/courses',
            search: DefaultSearchValues,
          }}
        />
      }
    >
      <CreateCourseFieldset />
    </PageLayout>
  );
}

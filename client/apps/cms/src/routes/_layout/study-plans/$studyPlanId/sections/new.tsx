import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/shared/components/PageLayout.tsx';
import { PageHeaderWithBack } from '@/shared/components/PageHeaderWithBack.tsx';
import { CreateSectionFieldset } from '@/features/study-plan/components/CreateSectionFieldset.tsx';

export const Route = createFileRoute('/_layout/study-plans/$studyPlanId/sections/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout
      header={
        <PageHeaderWithBack
          linkProps={{
            to: '/study-plans/$studyPlanId/sections',
          }}
          title="Create New Section"
        />
      }
    >
      <CreateSectionFieldset />
    </PageLayout>
  );
}

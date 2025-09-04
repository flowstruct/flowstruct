import { createFileRoute } from '@tanstack/react-router';
import { CreateStudyPlanFieldset } from '@/features/study-plan/components/CreateStudyPlanFieldset.tsx';
import { ProgramListQuery } from '@/features/program/queries.ts';
import { PageHeaderWithBack } from '@/shared/components/PageHeaderWithBack.tsx';
import { PageLayout } from '@/shared/components/PageLayout.tsx';

export const Route = createFileRoute('/_layout/study-plans/new')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(ProgramListQuery);
  },
});

function RouteComponent() {
  return (
    <PageLayout
      header={<PageHeaderWithBack title="Create New Study Plan" linkProps={{ to: '..' }} />}
    >
      <CreateStudyPlanFieldset />
    </PageLayout>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { CreateProgramFieldset } from '@/features/program/components/CreateProgramFieldset.tsx';
import { PageHeaderWithBack } from '@/shared/components/PageHeaderWithBack.tsx';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { PageLayout } from '@/shared/components/PageLayout.tsx';

export const Route = createFileRoute('/_layout/catalog/programs/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout
      header={
        <PageHeaderWithBack
          title="Create New Program"
          linkProps={{
            to: '/catalog/programs',
            search: DefaultSearchValues,
          }}
        />
      }
    >
      <CreateProgramFieldset />
    </PageLayout>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/shared/components/PageLayout.tsx';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { PageHeaderWithBack } from '@/shared/components/PageHeaderWithBack.tsx';
import { CreateUserFieldset } from '@/features/user/components/CreateUserFieldset.tsx';

export const Route = createFileRoute('/_layout/users/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout
      header={
        <PageHeaderWithBack
          title="Create New User"
          linkProps={{
            to: '/users',
            search: DefaultSearchValues,
          }}
        />
      }
    >
      <CreateUserFieldset />
    </PageLayout>
  );
}

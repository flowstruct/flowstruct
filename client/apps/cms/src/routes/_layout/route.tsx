import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/shared/components/AppLayout.tsx';
import { UserListQuery } from '@/features/user/queries.ts';

export const Route = createFileRoute('/_layout')({
  beforeLoad: async ({ context, location }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: location.pathname } });
    }
  },
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(UserListQuery);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

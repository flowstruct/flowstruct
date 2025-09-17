import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppShell } from '@/shared/components/app-shell';
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
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { userQueries } from '@/features/user/queries';
import { AppShell } from '@/shared/components/app-shell';

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context, location }) => {
    if (!context.isAuthenticated) {
      console.log('app route isAuthenticated: false');
      throw redirect({ to: '/login', search: { redirect: location.pathname } });
    }
  },
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(userQueries.collection);
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

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { userQueries } from '@/features/user/queries.ts';
import { AppShell } from '@/shared/components/app-shell.tsx';

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context, location }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: location.pathname } });
    }
  },
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(userQueries.me);
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

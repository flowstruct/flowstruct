import { useEffect } from 'react';
import { createRootRouteWithContext, Outlet, useRouterState } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { nprogress } from '@mantine/nprogress';
import { MeQuery } from '@/features/user/queries.ts';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  isAuthenticated: boolean;
}>()({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(MeQuery);

      return {
        isAuthenticated: true,
      };
    } catch {
      return {
        isAuthenticated: false,
      };
    }
  },
  component: RootComponent,
});

function RootComponent() {
  const { status } = useRouterState();

  useEffect(() => {
    if (status === 'pending') nprogress.start();
    if (status === 'idle') nprogress.complete();
  }, [status]);

  return <Outlet />;
}

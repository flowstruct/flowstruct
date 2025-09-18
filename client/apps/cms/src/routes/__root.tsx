import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
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
  component: () => <Outlet />,
});

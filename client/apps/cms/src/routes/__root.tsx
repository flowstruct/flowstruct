import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { userQueries } from '@/features/user/queries';
import { userApi } from '@/features/user/api';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  isAuthenticated: boolean;
}>()({
  beforeLoad: async ({ context }) => {
    try {
      const me = await userApi.getMe();
      context.queryClient.setQueryData(userQueries.me.queryKey, me);

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

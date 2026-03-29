import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { userQueries } from '@/features/user/queries';
import { computeHasPermission } from '@/features/user/domain/computeHasPermission';

export const Route = createFileRoute('/_app/admin')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(userQueries.me);
    if (!computeHasPermission(user, 'users:read')) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Outlet />,
});

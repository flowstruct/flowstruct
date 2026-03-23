import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { userQueries } from '@/features/user/queries';

export const Route = createFileRoute('/_app/admin')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(userQueries.me);
    if (user.role !== 'ADMIN') {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Outlet />,
});
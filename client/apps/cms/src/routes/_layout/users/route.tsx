import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { MeQuery } from '@/features/user/queries.ts';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';

export const Route = createFileRoute('/_layout/users')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(MeQuery);
    if (user.role !== 'ADMIN') {
      throw redirect({ to: '/study-plans', search: DefaultSearchValues() });
    }
  },
  component: () => <Outlet />,
});

import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/features/user/components/LoginForm.tsx';

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: async ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: () => <LoginForm />,
});

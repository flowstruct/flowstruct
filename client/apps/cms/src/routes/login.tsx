import { createFileRoute, redirect, useNavigate, useSearch } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/features/user/api';
import { handleSubmit } from '@/shared/utils/handle-submit';
import styles from '@/routes/login.module.css';
import { TextField } from '@/shared/components/ui/TextField';
import { Button } from '@/shared/components/ui/Button';
import { LogIn } from 'lucide-react';
import { Text } from '@/shared/components/layout/text';
import logo from '@/assets/logo.png';

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: async ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: () => <LoginPage />,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: '/login' });

  const login = useMutation({
    mutationFn: userApi.login,
    onSuccess: () => {
      navigate({ to: redirect });
    },
    meta: {
      successMessage: 'You are logged in. Redirecting...',
    },
  });

  const onSubmit = handleSubmit<{ username: string; password: string }>((data) => {
    login.mutate(data);
  });

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.header}>
          <img src={logo} width="50" />

          <h1 className={styles.title}>Flowstruct</h1>
        </div>

        <div className={styles.fields}>
          <TextField
            name="username"
            label="Username"
            placeholder="Type your username"
            isRequired
            autoComplete="off"
          />

          <TextField
            name="password"
            type="password"
            label="Password"
            placeholder="Type your password"
            isRequired
            autoComplete="off"
          />
        </div>

        <div className={styles.submit}>
          <Button type="submit" variant="primary" fullWidth isPending={login.isPending}>
            <LogIn size={15} />
            Login
          </Button>

          <Text size="xs" align="center" tone="dimmed">
            © {new Date().getFullYear()} Flowstruct. All rights reserved.
          </Text>
        </div>
      </form>
    </main>
  );
}

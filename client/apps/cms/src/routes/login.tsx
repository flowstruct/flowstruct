import { createFileRoute, redirect, useNavigate, useSearch } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/features/user/api';
import { handleSubmit } from '@/shared/utils/handle-submit';
import styles from '@/routes/login.module.css';
import { TextField } from '@/shared/components/ui/TextField';
import { Button } from '@/shared/components/ui/Button';

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: async ({ context, search }) => {
    if (context.isAuthenticated) {
      console.log('login route isAuthenticated: true');
      throw redirect({ to: search.redirect });
    } else {
      console.log('login route isAuthenticated: false');
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
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.title}>flowstruct</div>
        <TextField
          name="username"
          label="Username"
          placeholder="Enter your username"
          isRequired
          autoComplete="off"
        />
        <TextField
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          isRequired
          autoComplete="off"
        />
        <Button type="submit" variant="primary" fullWidth isPending={login.isPending}>
          Login
        </Button>
      </form>
    </div>
  );
}

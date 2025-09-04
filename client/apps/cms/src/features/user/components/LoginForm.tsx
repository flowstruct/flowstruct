import {
  Box,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from '../styles/LoginForm.module.css';
import { LoginSchema } from '@/features/user/schemas.ts';
import { useLogin } from '@/features/user/hooks/useLogin.ts';
import { Controller, useForm } from 'react-hook-form';
import { LogIn } from 'lucide-react';
import { z } from 'zod/v4';
import { customResolver } from '@/utils/customResolver.ts';

export function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: customResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const login = useLogin();

  const onSubmit = form.handleSubmit((data) => {
    login.mutate(data);
  });

  return (
    <Container size={420} my={40} className={classes.wrapper}>
      <Box className={classes.logoContainer}>
        <Title ta="center" className={classes.title}>
          Flowstruct CMS
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          A Content Management System for Interactive Curriculums
        </Text>
      </Box>

      <Paper withBorder shadow="md" p={30} mt={30}>
        <form onSubmit={onSubmit}>
          <Stack>
            <Controller
              name="username"
              control={form.control}
              render={({ field }) => (
                <TextInput
                  label="Username"
                  placeholder="Enter your username"
                  {...field}
                  error={form.formState.errors.username?.message}
                  autoComplete="off"
                  withAsterisk
                />
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  {...field}
                  error={form.formState.errors.password?.message}
                  autoComplete="off"
                  withAsterisk
                />
              )}
            />
          </Stack>

          <Button
            leftSection={<LogIn size={18} />}
            loading={login.isPending}
            type="submit"
            fullWidth
            mt="xl"
          >
            Sign In
          </Button>
        </form>

        <Text size="xs" ta="center" mt="lg" c="dimmed">
          © {new Date().getFullYear()} Flowstruct. All rights reserved.
        </Text>
      </Paper>
    </Container>
  );
}

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { newUserSchema } from '@/features/user/schemas.ts';
import { customResolver } from '@/utils/customResolver.ts';
import { useCreateUser } from '@/features/user/hooks/useCreateUser.ts';
import { Link, useNavigate } from '@tanstack/react-router';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { AppCard } from '@/shared/components/AppCard.tsx';
import { Button, Divider, Group, PasswordInput, Select, Stack, TextInput } from '@mantine/core';
import { Lock, Mail, Plus, Shield, User, X } from 'lucide-react';
import { Role } from '@/features/user/types.ts';
import { PasswordRequirements } from '@/features/user/components/PasswordRequirements.tsx';

export function CreateUserFieldset() {
  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: customResolver(newUserSchema),
    defaultValues: {
      username: '',
      email: '',
      role: 'GUEST',
      password: '',
      confirmPassword: '',
    },
  });

  const createUser = useCreateUser();
  const navigate = useNavigate();

  const onSubmit = form.handleSubmit((data) => {
    createUser.mutate(data, {
      onSuccess: () => {
        navigate({ to: '/users', search: DefaultSearchValues() });
      },
    });
  });

  const footer = (
    <>
      <Link search={DefaultSearchValues()} to="/users">
        <Button variant="default" leftSection={<X size={18} />}>
          Cancel
        </Button>
      </Link>

      <Button
        disabled={!form.formState.isValid}
        type="submit"
        leftSection={<Plus size={18} />}
        loading={createUser.isPending}
      >
        Save User
      </Button>
    </>
  );

  return (
    <form onSubmit={onSubmit}>
      <AppCard
        title="User Details"
        subtitle="Enter the details for the new user here"
        footer={footer}
      >
        <Stack>
          <Group grow align="start">
            <Controller
              name="username"
              control={form.control}
              render={({ field }) => (
                <TextInput
                  label="Username"
                  leftSection={<User size={18} />}
                  {...field}
                  error={form.formState.errors.username?.message}
                  autoComplete="off"
                  withAsterisk
                />
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <Select
                  label="Role"
                  leftSection={<Shield size={18} />}
                  data={Object.entries(Role).map(([key, label]) => ({
                    value: key,
                    label,
                  }))}
                  {...field}
                  error={form.formState.errors.role?.message}
                  allowDeselect={false}
                  withAsterisk
                />
              )}
            />
          </Group>

          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <TextInput
                label="Email"
                leftSection={<Mail size={18} />}
                {...field}
                error={form.formState.errors.email?.message}
                autoComplete="off"
                withAsterisk
              />
            )}
          />

          <Divider />

          <PasswordRequirements />

          <Controller
            name="password"
            control={form.control}
            render={({ field }) => (
              <PasswordInput
                label="Password"
                leftSection={<Lock size={18} />}
                {...field}
                error={form.formState.errors.password?.message}
                autoComplete="new-password"
                withAsterisk
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <PasswordInput
                label="Confirm Password"
                placeholder="Enter password again"
                leftSection={<Lock size={18} />}
                {...field}
                error={form.formState.errors.confirmPassword?.message}
                autoComplete="off"
                withAsterisk
              />
            )}
          />
        </Stack>
      </AppCard>
    </form>
  );
}

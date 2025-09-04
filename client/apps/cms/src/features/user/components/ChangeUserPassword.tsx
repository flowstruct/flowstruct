import { Button, Fieldset, Group, PasswordInput, Stack } from '@mantine/core';
import { Lock, Pencil, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { changeUserPasswordSchema } from '@/features/user/schemas.ts';
import { customResolver } from '@/utils/customResolver.ts';
import { modals } from '@mantine/modals';
import { PasswordRequirements } from '@/features/user/components/PasswordRequirements.tsx';
import { canSubmit } from '@/utils/canSubmit.ts';
import { User } from '@/features/user/types.ts';
import { useChangeUserPassword } from '@/features/user/hooks/useChangeUserPassword.ts';

type Props = {
  user: User;
};

export function ChangeUserPasswordForm({ user }: Props) {
  const form = useForm<z.infer<typeof changeUserPasswordSchema>>({
    resolver: customResolver(changeUserPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changeUserPassword = useChangeUserPassword();

  const onSubmit = form.handleSubmit((data) => {
    changeUserPassword.mutate(
      {
        userId: user.id,
        ...data,
      },
      {
        onSuccess: () => {
          modals.closeAll();
        },
      }
    );
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <PasswordRequirements />

        <Fieldset variant="filled">
          <Stack>
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <PasswordInput
                  data-autofocus
                  label="New Password"
                  {...field}
                  error={form.formState.errors.newPassword?.message}
                  autoComplete="new-password"
                  withAsterisk
                  leftSection={<Lock size={18} />}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <PasswordInput
                  label="Confirm New Password"
                  {...field}
                  error={form.formState.errors.confirmPassword?.message}
                  autoComplete="off"
                  withAsterisk
                  leftSection={<Lock size={18} />}
                />
              )}
            />
          </Stack>
        </Fieldset>

        <Group justify="space-between">
          <Button onClick={() => modals.closeAll()} variant="default" leftSection={<X size={18} />}>
            Cancel
          </Button>

          <Button
            type="submit"
            loading={changeUserPassword.isPending}
            leftSection={<Pencil size={18} />}
            disabled={!canSubmit(form)}
          >
            Change Password
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
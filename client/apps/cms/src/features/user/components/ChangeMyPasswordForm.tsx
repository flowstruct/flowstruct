import { Button, Fieldset, Group, PasswordInput, Stack } from '@mantine/core';
import { Lock, Pencil, X } from 'lucide-react';
import { useChangeMyPassword } from '@/features/user/hooks/useChangeMyPassword.ts';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { changeMyPasswordSchema } from '@/features/user/schemas.ts';
import { customResolver } from '@/utils/customResolver.ts';
import { modals } from '@mantine/modals';
import { PasswordRequirements } from '@/features/user/components/PasswordRequirements.tsx';
import { canSubmit } from '@/utils/canSubmit.ts';

export function ChangeMyPasswordForm() {
  const form = useForm<z.infer<typeof changeMyPasswordSchema>>({
    resolver: customResolver(changeMyPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changePassword = useChangeMyPassword();

  const onSubmit = form.handleSubmit((data) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        modals.closeAll();
      },
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <PasswordRequirements />

        <Fieldset variant="filled">
          <Stack>
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field }) => (
                <PasswordInput
                  data-autofocus
                  label="Current Password"
                  {...field}
                  error={form.formState.errors.currentPassword?.message}
                  autoComplete="off"
                  withAsterisk
                  leftSection={<Lock size={18} />}
                />
              )}
            />

            <Controller
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <PasswordInput
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
            loading={changePassword.isPending}
            leftSection={<Pencil size={18} />}
            disabled={!canSubmit(form)}
          >
            Save Changes
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

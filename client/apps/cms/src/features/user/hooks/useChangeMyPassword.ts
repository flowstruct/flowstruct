import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { USER_ENDPOINT } from '@/features/user/constants.ts';
import { api } from '@/shared/api.ts';

const changeMyPassword = ({
  currentPassword,
  newPassword,
  confirmPassword,
}: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) =>
  api.put<void>([USER_ENDPOINT, 'me', 'password'], {
    body: {
      currentPassword,
      newPassword,
      confirmPassword,
    },
  });

export const useChangeMyPassword = () =>
  useAppMutation({
    mutationFn: changeMyPassword,
    meta: {
      successMessage: 'Password changed.',
    },
  });

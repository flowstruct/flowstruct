import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { USER_ENDPOINT } from '@/features/user/constants.ts';

const changeUserPassword = ({
  userId,
  newPassword,
  confirmPassword,
}: {
  userId: number;
  newPassword: string;
  confirmPassword: string;
}) =>
  api.put<void>([USER_ENDPOINT, userId, 'password'], {
    body: {
      newPassword,
      confirmPassword,
    },
  });

export const useChangeUserPassword = () =>
  useAppMutation({
    mutationFn: changeUserPassword,
    meta: {
      successMessage: 'Changed user password.',
    },
  });

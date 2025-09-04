import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { USER_ENDPOINT } from '@/features/user/constants.ts';
import { User } from '@/features/user/types.ts';
import { userKeys } from '@/features/user/queries.ts';

const changeUserRole = ({ userId, newRole }: { userId: number; newRole: string }) =>
  api.put<User>([USER_ENDPOINT, userId, 'role'], {
    params: {
      role: newRole,
    },
  });

export const useChangeUserRole = () =>
  useAppMutation({
    mutationFn: changeUserRole,
    meta: {
      setData: (data) => [userKeys.detail(data.id)],
      invalidates: [userKeys.me(), userKeys.list()],
      successMessage: (data) => `${data.username} role changed to ${data.role}.`,
    },
  });

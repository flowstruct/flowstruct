import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { USER_ENDPOINT } from '@/features/user/constants.ts';
import { userKeys } from '@/features/user/queries.ts';

const deleteUser = (userId: number) => api.delete<void>([USER_ENDPOINT, userId]);

export const useDeleteUser = () =>
  useAppMutation({
    mutationFn: deleteUser,
    meta: {
      removes: (_, userId) => [userKeys.detail(userId)],
      invalidates: [userKeys.list()],
      successMessage: 'User deleted.',
    },
  });

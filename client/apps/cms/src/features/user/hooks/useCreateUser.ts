import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { User } from '@/features/user/types';
import { USER_ENDPOINT } from '@/features/user/constants.ts';
import { userKeys } from '@/features/user/queries.ts';

const createUser = (details: Partial<User>) =>
  api.post<User>([USER_ENDPOINT], {
    body: details,
  });

export const useCreateUser = () =>
  useAppMutation({
    mutationFn: createUser,
    meta: {
      setData: (data) => userKeys.detail(data.id),
      invalidates: [userKeys.list()],
      successMessage: 'User created.',
    },
  });

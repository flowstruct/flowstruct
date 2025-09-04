import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { api } from '@/shared/api.ts';
import { User } from '@/features/user/types.ts';
import { USER_ENDPOINT } from '@/features/user/constants.ts';
import { userKeys } from '@/features/user/queries.ts';

const editUserDetails = ({
  userId,
  details,
}: {
  userId: number;
  details: { username: string; email: string };
}) =>
  api.put<User>([USER_ENDPOINT, userId], {
    body: details,
  });

export const useEditUserDetails = () =>
  useAppMutation({
    mutationFn: editUserDetails,
    meta: {
      setData: (data) => userKeys.detail(data.id),
      invalidates: [userKeys.all],
      successMessage: 'User details updated.',
    },
  });

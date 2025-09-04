import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { USER_ENDPOINT } from '@/features/user/constants.ts';
import { userKeys } from '@/features/user/queries.ts';
import { User } from '@/features/user/types.ts';
import { api } from '@/shared/api.ts';

const editMyDetails = ({ details }: { details: Partial<User> }) =>
  api.put<User>([USER_ENDPOINT, 'me'], {
    body: details,
  });

export const useEditMyDetails = () =>
  useAppMutation({
    mutationFn: editMyDetails,
    meta: {
      setData: () => userKeys.me(),
      invalidates: [userKeys.list()],
      successMessage: 'Your details have been updated.',
    },
  });

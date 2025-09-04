import { useAppMutation } from '@/shared/hooks/useAppMutation.ts';
import { USER_ENDPOINT } from '@/features/user/constants.ts';
import { z } from 'zod/v4';
import { LoginSchema } from '@/features/user/schemas.ts';
import { api } from '@/shared/api.ts';
import { MeQuery } from '@/features/user/queries.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';

export const loginUser = (loginDetails: z.infer<typeof LoginSchema>) =>
  api.post([USER_ENDPOINT, 'login'], {
    body: loginDetails,
  });

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: '/login' });

  return useAppMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await queryClient.ensureQueryData(MeQuery);
      navigate({ to: redirect }).then(() => {});
    },
    meta: {
      successMessage: 'You are logged in. Redirecting...',
    },
  });
};

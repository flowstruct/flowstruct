import { z } from 'zod/v4';
import { LoginSchema } from '@/features/user/schemas.ts';
import { api } from '@/shared/api.ts';
import { User } from '@/features/user/domain/user.ts';

export const USER_ENDPOINT = '/users';

export const userApi = {
  login: (loginDetails: z.infer<typeof LoginSchema>) =>
    api.post([USER_ENDPOINT, 'login'], {
      body: loginDetails,
    }),
  getMe: () => api.get<User>([USER_ENDPOINT, 'me']),
  getUsers: () => api.get<User[]>(USER_ENDPOINT),
  getUser: (userId: number) => api.get<User>([USER_ENDPOINT, userId]),
};

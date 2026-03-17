import { api } from '@/shared/api';
import { User } from '@/features/user/domain/user';

export const USER_ENDPOINT = '/users';

export const userApi = {
  login: (req: { username: string; password: string }) =>
    api.post([USER_ENDPOINT, 'login'], {
      body: req,
    }),
  getMe: () => api.get<User>([USER_ENDPOINT, 'me']),
  getUsers: () => api.get<Record<number, User>>(USER_ENDPOINT),
  getUser: (userId: number) => api.get<User>([USER_ENDPOINT, userId]),
  logout: () => api.post([USER_ENDPOINT, 'logout']),
  editMyDetails: (data: { username: string; email: string }) =>
    api.put<User>([USER_ENDPOINT, 'me'], { body: data }),
  changeMyPassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => api.put([USER_ENDPOINT, 'me', 'password'], { body: data }),
};

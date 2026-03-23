import { api } from '@/shared/api';
import { User } from '@/features/user/domain/user';

export const USER_ENDPOINT = '/users';

type NewUserDetails = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

type EditUserDetails = {
  username: string;
  email: string;
};

type AdminPasswordReset = {
  newPassword: string;
  confirmPassword: string;
};

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

  createUser: (data: NewUserDetails) => api.post<User>(USER_ENDPOINT, { body: data }),
  editUser: (userId: number, data: EditUserDetails) =>
    api.put<User>([USER_ENDPOINT, userId], { body: data }),
  changeUserPassword: (userId: number, data: AdminPasswordReset) =>
    api.put([USER_ENDPOINT, userId, 'password'], { body: data }),
  changeUserRole: (userId: number, role: string) =>
    api.put<User>([USER_ENDPOINT, userId, 'role'], { params: { role } }),
  deleteUser: (userId: number) => api.delete([USER_ENDPOINT, userId]),
};

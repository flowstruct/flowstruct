import { queryOptions } from '@tanstack/react-query';
import { USER_ENDPOINT } from '@/features/user/constants.ts';
import { api } from '@/shared/api.ts';
import { User } from '@/features/user/types.ts';

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  details: () => [...userKeys.all, 'detail'],
  detail: (userId: number) => [...userKeys.details(), userId],
};

export const MeQuery = queryOptions({
  queryKey: userKeys.me(),
  queryFn: () => api.get<User>([USER_ENDPOINT, 'me']),
});

export const UserListQuery = queryOptions({
  queryKey: userKeys.list(),
  queryFn: () => api.get<Record<number, User>>([USER_ENDPOINT]),
});

export const UserQuery = (userId: number) =>
  queryOptions({
    queryKey: userKeys.detail(userId),
    queryFn: () => api.get<User>([USER_ENDPOINT, userId]),
  });

import { queryOptions } from '@tanstack/react-query';
import { userApi } from '@/features/user/api.ts';

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (userId: number) => [...userKeys.details(), userId],
};

export const userQueries = {
  list: queryOptions({
    queryKey: userKeys.list(),
    queryFn: userApi.getUsers,
  }),

  detail: (userId: number) =>
    queryOptions({
      queryKey: userKeys.detail(userId),
      queryFn: () => userApi.getUser(userId),
    }),

  me: queryOptions({
    queryKey: userKeys.me(),
    queryFn: userApi.getMe,
  }),
};

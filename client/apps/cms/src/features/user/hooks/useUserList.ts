import { useSuspenseQuery } from '@tanstack/react-query';
import { UserListQuery } from '@/features/user/queries.ts';

export const useUserList = () => {
  return useSuspenseQuery(UserListQuery);
};
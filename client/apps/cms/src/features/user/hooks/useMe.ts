import { useSuspenseQuery } from '@tanstack/react-query';
import { MeQuery } from '@/features/user/queries.ts';

export const useMe = () => {
  return useSuspenseQuery(MeQuery);
};

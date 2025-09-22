import { User, UserAction } from '@/features/user/domain/user.ts';
import { useQueryClient } from '@tanstack/react-query';
import { computeHasPermission } from '@/features/user/domain/computeHasPermission.ts';
import { userKeys } from '@/features/user/queries.ts';

export const usePermission = () => {
  const queryClient = useQueryClient();
  const me: User | undefined = queryClient.getQueryData(userKeys.me());
  if (!me) return { hasPermission: false };

  return { hasPermission: (action: UserAction) => computeHasPermission(me, action) };
};

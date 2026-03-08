import { User, UserAction } from '@/features/user/domain/user';
import { useQueryClient } from '@tanstack/react-query';
import { computeHasPermission } from '@/features/user/domain/computeHasPermission';
import { userKeys } from '@/features/user/queries';

export const usePermission = () => {
  const queryClient = useQueryClient();
  const me: User | undefined = queryClient.getQueryData(userKeys.me());
  if (!me) return { hasPermission: false };

  return { hasPermission: (action: UserAction) => computeHasPermission(me, action) };
};

import { Role, User } from '@/features/user/types.ts';
import { userKeys } from '@/features/user/queries.ts';
import { useQueryClient } from '@tanstack/react-query';

type UserAction =
  | 'study-plans:approve'
  | 'users:read'
  | 'study-plans:archive'
  | 'courses:mark-outdated'
  | 'programs:mark-outdated';

const RolePermissions: Record<keyof typeof Role, () => UserAction[]> = {
  GUEST: () => [] as const,
  EDITOR: () => [] as const,
  APPROVER: () =>
    [
      ...RolePermissions.GUEST(),
      'study-plans:approve',
      'study-plans:archive',
      'programs:mark-outdated',
      'courses:mark-outdated',
    ] as const,
  ADMIN: () => [...RolePermissions.APPROVER(), 'users:read'] as const,
};

export const usePermission = () => {
  const queryClient = useQueryClient();

  const hasPermission = (action: UserAction) => {
    const me: User | undefined = queryClient.getQueryData(userKeys.me());
    if (!me) return false;

    const myPermissions = RolePermissions[me.role as keyof typeof Role];

    return myPermissions().includes(action);
  };

  return { hasPermission };
};

import { Role, User, UserAction } from '@/features/user/domain/user';

export const RolePermissions: Record<keyof typeof Role, () => UserAction[]> = {
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

export const computeHasPermission = (user: User, action: UserAction) => {
  const myPermissions = RolePermissions[user.role as keyof typeof Role];
  return myPermissions().includes(action);
};

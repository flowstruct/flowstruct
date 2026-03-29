import { Role, User, UserAction } from '@/features/user/domain/user';

export const RolePermissions: Record<keyof typeof Role, () => UserAction[]> = {
  GUEST: () => [] as const,
  EDITOR: () => ['site-generator:manage'] as const,
  APPROVER: () =>
    [
      ...RolePermissions.EDITOR(),
      'study-plans:approve',
      'study-plans:archive',
      'study-plans:edit',
      'programs:mark-outdated',
      'courses:mark-outdated',
    ] as const,
  ADMIN: () => [...RolePermissions.APPROVER(), 'users:read'] as const,
};

export const computeHasPermission = (user: User, action: UserAction) => {
  const myPermissions = RolePermissions[user.role as keyof typeof Role];
  if (user.role === 'GUEST') return true;
  return myPermissions().includes(action);
};

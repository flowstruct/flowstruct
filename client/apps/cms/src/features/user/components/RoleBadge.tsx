import { Badge, BadgeProps } from '@mantine/core';
import { Role } from '@/features/user/types.ts';
import { Crown, Eye, Pencil, Stamp, User as UserIcon } from 'lucide-react';

type Props = {
  role: string;
};

const roleIcons = {
  ADMIN: <Crown size={14} />,
  APPROVER: <Stamp size={14} />,
  EDITOR: <Pencil size={14} />,
  GUEST: <Eye size={14} />,
} as const;

const getRoleBadgeProps = (roleKey: string): BadgeProps => {
  switch (roleKey) {
    case 'ADMIN':
      return {
        color: 'red',
      };
    case 'APPROVER':
      return {
        color: 'blue',
      };
    case 'EDITOR':
      return {
        color: 'green',
      };
    case 'GUEST':
      return {
        color: 'gray',
      };
    default:
      return {
        color: 'gray',
        variant: 'outline',
      };
  }
};

const getRoleDisplayName = (roleKey: string): string => {
  return Role[roleKey as keyof typeof Role] || roleKey;
};

export function RoleBadge({ role }: Props) {
  const badgeProps = getRoleBadgeProps(role);
  const displayName = getRoleDisplayName(role);
  const icon = roleIcons[role as keyof typeof roleIcons] || <UserIcon size={14} />;

  return (
    <Badge {...badgeProps} variant="light" leftSection={icon}>
      {displayName}
    </Badge>
  );
}

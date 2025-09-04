import { Group, Loader, Menu, Text } from '@mantine/core';
import { useChangeUserRole } from '@/features/user/hooks/useChangeUserRole.ts';
import { Check, Crown, Eye, Pencil, Stamp } from 'lucide-react';
import { Role, User } from '@/features/user/types.ts';
import { useMe } from '@/features/user/hooks/useMe.ts';
import { modals } from '@mantine/modals';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';
import { useNavigate } from '@tanstack/react-router';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';

type RoleMenuItemsProps = {
  user: User;
};

const roleIcons = {
  ADMIN: <Crown size={14} />,
  APPROVER: <Stamp size={14} />,
  EDITOR: <Pencil size={14} />,
  GUEST: <Eye size={14} />,
} as const;

export function RoleMenuItems({ user }: RoleMenuItemsProps) {
  const changeUserRole = useChangeUserRole();
  const { data: me } = useMe();
  const navigate = useNavigate();

  const handleChangeUserRole = (newRole: string) => {
    const mutation = () =>
      changeUserRole.mutate({
        userId: user.id,
        newRole,
      });

    if (user.id === me.id) {
      modals.openConfirmModal({
        title: (
          <ModalHeader
            title="Change Role Warning"
            subtitle="Changing your role will reduce your access"
          />
        ),
        children:
          'You are about to change your role from Administrator to a role with fewer permissions. This action will immediately limit your ability to manage system settings, users, and high-level resources. Once saved, you will no longer be able to restore your admin privileges yourself, another administrator will have to do it for you.',
        onConfirm: () => {
          mutation();
          navigate({ to: '/study-plans', search: DefaultSearchValues() });
        },
        onCancel: () => modals.closeAll(),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
      });

      return;
    }

    mutation();
  };

  return (
    <>
      {Object.entries(Role).map(([key, roleName]) => {
        const isSelected = user.role === key;

        return (
          <Menu.Item
            key={key}
            onClick={() => handleChangeUserRole(key)}
            leftSection={roleIcons[key as keyof typeof roleIcons]}
          >
            <Group gap="xs">
              <Text size="sm">{roleName}</Text>
              {isSelected && changeUserRole.isPending ? (
                <Loader size={14} color="gray" ml="auto" />
              ) : (
                isSelected && <Check color="gray" size={14} />
              )}
            </Group>
          </Menu.Item>
        );
      })}
    </>
  );
}

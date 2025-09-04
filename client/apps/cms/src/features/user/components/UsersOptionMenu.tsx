import { ActionIcon, Menu, Text } from '@mantine/core';
import { Ellipsis, Lock, Pencil, Shield, Trash } from 'lucide-react';
import { User } from '@/features/user/types.ts';
import { modals } from '@mantine/modals';
import { EditUserForm } from './EditUserForm.tsx';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';
import { RoleMenuItems } from './RoleMenuItems.tsx';
import { ChangeUserPasswordForm } from '@/features/user/components/ChangeUserPassword.tsx';
import { useDeleteUser } from '@/features/user/hooks/useDeleteUser.ts';

type Props = {
  user: User;
};

export function UsersOptionMenu({ user }: Props) {
  const deleteUser = useDeleteUser();

  const handleEditDetails = () => {
    modals.open({
      title: <ModalHeader title="Edit User Details" subtitle="Update the details for this user" />,
      children: <EditUserForm user={user} />,
      centered: true,
    });
  };

  const handleChangePassword = () => {
    modals.open({
      title: (
        <ModalHeader
          subtitle="Enter your current password, then enter the new password and confirm it"
          title="Change Password"
        />
      ),
      children: <ChangeUserPasswordForm user={user} />,
      centered: true,
      size: 'lg',
    });
  };

  const handleDelete = () => {
    deleteUser.mutate(user.id);
  };

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="transparent" color="gray">
          <Ellipsis size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>

        <Menu.Item leftSection={<Pencil size={14} />} onClick={handleEditDetails}>
          Edit Details
        </Menu.Item>

        <Menu.Sub>
          <Menu.Sub.Target>
            <Menu.Sub.Item leftSection={<Shield size={14} />}>Change role</Menu.Sub.Item>
          </Menu.Sub.Target>

          <Menu.Sub.Dropdown>
            <RoleMenuItems user={user} />
          </Menu.Sub.Dropdown>
        </Menu.Sub>

        <Menu.Divider />

        <Menu.Item leftSection={<Lock size={14} />} onClick={handleChangePassword}>
          Change Password
        </Menu.Item>

        <Menu.Item
          color="red"
          leftSection={<Trash size={14} />}
          onClick={() =>
            modals.openConfirmModal({
              title: <ModalHeader title="Please Confirm Your Action" />,
              children: (
                <Text size="sm">
                  Are you sure you want to delete this user? This action cannot be undone.
                </Text>
              ),
              labels: { confirm: 'Delete User', cancel: 'Cancel' },
              confirmProps: { color: 'red' },
              onConfirm: handleDelete,
            })
          }
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

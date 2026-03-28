import styles from './user-action-menu.module.css';
import { userApi } from '@/features/user/api';
import { User } from '@/features/user/domain/user';
import { useMutation } from '@tanstack/react-query';
import {
  Ellipsis,
  Pencil,
  Trash,
  User as UserIcon,
  Crown,
  Shield,
  Edit,
  Eye,
  Save,
  Lock,
  Users,
} from 'lucide-react';
import React from 'react';
import { Menu, MenuItem, MenuTrigger, SubmenuTrigger } from '@/shared/components/ui/Menu';
import { Popover } from '@/shared/components/ui/Popover';
import { Button } from '@/shared/components/ui/Button';
import {
  FormModal,
  FormModalBody,
  FormModalContent,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
} from '@/shared/components/form-modal';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { UserDetailsFormFields } from './user-details-form-fields';
import { UserPasswordFormFields } from './user-password-form-fields';
import { ConfirmationModal } from '@/shared/components/confirmation-modal';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';
import { formatDate } from '@/shared/utils/formatDate';

type UserActionMenuProps = {
  user: User;
};

export function UserActionMenu({ user }: UserActionMenuProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

  const editUser = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      userApi.editUser(user.id, {
        username: data.username as string,
        email: data.email as string,
      }),
    meta: { successMessage: 'User updated.' },
  });

  const changePassword = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      userApi.changeUserPassword(user.id, {
        newPassword: data.newPassword as string,
        confirmPassword: data.confirmPassword as string,
      }),
    meta: { successMessage: 'Password changed.' },
    onSuccess: () => {
      setChangePasswordOpen(false);
    },
  });

  const changeRole = useMutation({
    mutationFn: (role: string) => userApi.changeUserRole(user.id, role),
    meta: { successMessage: 'Role changed.' },
  });

  const deleteUser = useMutation({
    mutationFn: () => userApi.deleteUser(user.id),
    meta: { successMessage: 'User deleted.' },
  });

  const roleOptions = [
    { value: 'ADMIN', label: 'Administrator', icon: <Crown size={14} /> },
    { value: 'APPROVER', label: 'Approver', icon: <Shield size={14} /> },
    { value: 'EDITOR', label: 'Editor', icon: <Edit size={14} /> },
    { value: 'GUEST', label: 'Guest', icon: <Eye size={14} /> },
  ];

  return (
    <>
      <ConfirmationModal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        header={`Delete ${user.username}`}
        text={`Are you sure you want to delete "${user.username}"? This action cannot be undone.`}
        onConfirm={() => deleteUser.mutate()}
        submitLabel="Delete"
        submitIcon={<Trash size={14} />}
        theme="danger"
      />

      <FormModal
        size="md"
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={(data) => editUser.mutate(data)}
      >
        <FormModalBody>
          <FormModalHeader>
            <Breadcrumbs>
              <Breadcrumb base>
                <Users size={15} /> Users
              </Breadcrumb>

              <Breadcrumb>
                <Pencil size={15} color="teal" /> Edit details
              </Breadcrumb>

              <Breadcrumb>
                <UserIcon size={15} color="teal" /> {user.username}
              </Breadcrumb>
            </Breadcrumbs>
          </FormModalHeader>

          <FormModalContent>
            <UserDetailsFormFields
              defaultValues={{
                username: user.username,
                email: user.email,
              }}
            />
          </FormModalContent>

          <FormModalFooter>
            <FormModalSubmit isPending={editUser.isPending}>
              <Save size={15} /> Save
            </FormModalSubmit>
          </FormModalFooter>
        </FormModalBody>
      </FormModal>

      <FormModal
        size="md"
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        onSubmit={(data) => changePassword.mutate(data)}
      >
        <FormModalBody>
          <FormModalHeader>
            <Breadcrumbs>
              <Breadcrumb base>
                <Users size={15} /> Users
              </Breadcrumb>

              <Breadcrumb>
                <Lock size={15} color="teal" /> Change password
              </Breadcrumb>

              <Breadcrumb>
                <UserIcon size={15} color="teal" />
                {user.username}
              </Breadcrumb>
            </Breadcrumbs>
          </FormModalHeader>

          <FormModalContent>
            <UserPasswordFormFields />
          </FormModalContent>

          <FormModalFooter>
            <FormModalSubmit isPending={changePassword.isPending}>
              <Save size={15} /> Save
            </FormModalSubmit>
          </FormModalFooter>
        </FormModalBody>
      </FormModal>

      <MenuTrigger>
        <Button shape="icon" variant="ghost" isPending={editUser.isPending}>
          <Ellipsis size={15} />
        </Button>

        <Popover hideArrow placement="bottom right" crossOffset={25}>
          <Menu width={200}>
            <MenuItem onAction={() => setEditOpen(true)}>
              <Pencil size={14} /> Edit details
            </MenuItem>

            <MenuItem onAction={() => setChangePasswordOpen(true)}>
              <Lock size={14} /> Change password
            </MenuItem>

            <SubmenuTrigger>
              <MenuItem>
                <Shield size={14} /> Change role
              </MenuItem>
              <Popover hideArrow>
                <Menu>
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} onAction={() => changeRole.mutate(option.value)}>
                      {option.icon} {option.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Popover>
            </SubmenuTrigger>

            <MenuItem onAction={() => setConfirmDeleteOpen(true)}>
              <Trash size={14} /> Delete
            </MenuItem>
          </Menu>

          <section className={styles.userActivity}>
            <p>Edited {formatTimeAgo(new Date(user.updatedAt))}</p>
            <p className={styles.createdAt}>Created {formatDate(new Date(user.createdAt))}</p>
          </section>
        </Popover>
      </MenuTrigger>
    </>
  );
}

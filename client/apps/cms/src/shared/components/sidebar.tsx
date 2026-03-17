import styles from './sidebar.module.css';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu';
import {
  Brush,
  ChevronsUpDown,
  Crown,
  Folder,
  Grid2X2,
  Info,
  Layers2,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Save,
  Settings2,
  User,
  Users,
} from 'lucide-react';
import { Role } from '@/features/user/domain/user';
import { Popover } from '@/shared/components/ui/Popover';
import { getUserInitials } from '@/features/user/domain/getUserInitials';
import { useMatches, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { userQueries, userKeys } from '@/features/user/queries';
import { userApi } from '@/features/user/api';
import { ProgressCircle } from '@/shared/components/ui/ProgressCircle';
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
} from '@/shared/components/form-modal';
import React from 'react';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { TextField } from '@/shared/components/ui/TextField';

const sidebarSections = [
  {
    items: [
      {
        icon: Layers2,
        label: 'Flowsheets',
        route: '/flowsheets',
      },
    ],
  },
  {
    header: 'Catalog',
    items: [
      {
        icon: Folder,
        label: 'Schools',
        route: '/schools',
      },
      {
        icon: Folder,
        label: 'Departments',
        route: '/departments',
      },
      {
        icon: Folder,
        label: 'Programs',
        route: '/programs',
      },
      {
        icon: Folder,
        label: 'Courses',
        route: '/courses',
      },
    ],
  },
  {
    header: 'Admin',
    items: [
      {
        icon: User,
        label: 'Manage users',
        route: '/admin/users',
      },
      {
        icon: Brush,
        label: 'Style editor',
        route: '/admin/style',
      },
    ],
  },
];

const footerItems = [
  {
    icon: Settings2,
    label: 'Settings',
    route: '/settings',
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const matches = useMatches();

  const fullPath = matches.at(-1)?.fullPath ?? '';
  const isActive = (route: string) => fullPath.includes(route);

  return (
    <aside className={styles.sidebar}>
      <UserProfile />

      <section className={styles.sidebarMenu}>
        {sidebarSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.header && (
              <section className={styles.sidebarMenuSection}>
                <h3>{section.header}</h3>
              </section>
            )}

            {section.items.map((item) => {
              return (
                <UnstyledButton
                  key={item.route}
                  className={styles.sidebarMenuItem}
                  data-active={isActive(item.route) || undefined}
                  onPress={() => navigate({ to: item.route })}
                >
                  <item.icon size={16} />
                  {item.label}
                </UnstyledButton>
              );
            })}
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        {footerItems.map((item) => {
          return (
            <UnstyledButton
              key={item.route}
              className={styles.sidebarMenuItem}
              onPress={() => navigate({ to: item.route })}
            >
              <item.icon size={16} />
              {item.label}
            </UnstyledButton>
          );
        })}
      </footer>
    </aside>
  );
}

export function UserProfile() {
  const { data: me } = useSuspenseQuery(userQueries.me);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      queryClient.cancelQueries();
      navigate({ to: '/login' });
    },
    meta: {
      invalidate: false,
    },
  });

  const editDetails = useMutation({
    mutationFn: userApi.editMyDetails,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.me() }),
    meta: { successMessage: 'Details updated.' },
  });

  const changePassword = useMutation({
    mutationFn: userApi.changeMyPassword,
    meta: { successMessage: 'Password changed.' },
  });

  const isPending = editDetails.isPending || changePassword.isPending;

  return (
    <>
      <FormModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        size="lg"
        onSubmit={async (data) => {
          const result = await editDetails.mutateAsync({
            username: data.username as string,
            email: data.email as string,
          });

          const hasPassword = data.newPassword || data.confirmPassword;

          if (hasPassword) {
            await changePassword.mutateAsync({
              currentPassword: data.currentPassword as string,
              newPassword: data.newPassword as string,
              confirmPassword: data.confirmPassword as string,
            });
          }

          return result;
        }}
      >
        <FormModalBody>
          <FormModalHeader>
            <Breadcrumbs>
              <Breadcrumb base>
                <Users size={15} /> Users
              </Breadcrumb>

              <Breadcrumb>
                <User size={15} color="teal" />
                {me.username}
              </Breadcrumb>

              <Breadcrumb>
                <Pencil size={15} color="teal" /> Edit details
              </Breadcrumb>
            </Breadcrumbs>
          </FormModalHeader>

          <UserDetailsFormFields defaultValues={{ username: me.username, email: me.email }} />
        </FormModalBody>

        <FormModalFooter>
          <FormModalSubmit isPending={isPending}>
            <Save size={15} /> Save changes
          </FormModalSubmit>
        </FormModalFooter>
      </FormModal>

      <MenuTrigger>
        <UnstyledButton className={styles.userProfile}>
          <div className={styles.userInitials}>{getUserInitials(me.username)}</div>

          <div>
            <h1 className={styles.username}>{me.username}</h1>

            <div className={styles.userRole}>
              <Crown size={13} />
              <p className={styles.userRole}>{Role[me.role as keyof typeof Role]}</p>
            </div>
          </div>

          {logout.isPending ? (
            <ProgressCircle className={styles.userProfileChevron} isIndeterminate />
          ) : (
            <ChevronsUpDown className={styles.userProfileChevron} size={15} />
          )}
        </UnstyledButton>

        <Popover hideArrow>
          <Menu width={200}>
            <MenuItem textValue="Settings">
              <Settings2 size={14} />
              <span>Settings</span>
            </MenuItem>

            <MenuItem onAction={() => setDetailsOpen(true)} textValue="details">
              <Pencil size={14} />
              Change details
            </MenuItem>

            <MenuItem onPress={() => logout.mutate()} textValue="Settings">
              <LogOut size={14} />
              <span>Log out</span>
            </MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
    </>
  );
}

type UserDetailsFormFieldsProps = {
  defaultValues: {
    username: string;
    email: string;
  };
};

function UserDetailsFormFields({ defaultValues }: UserDetailsFormFieldsProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <TextField
        name="username"
        label="Username"
        placeholder="Enter username"
        defaultValue={defaultValues.username}
        isRequired
        icon={<User size={14} />}
      />

      <TextField
        name="email"
        label="Email"
        type="email"
        placeholder="Enter email address"
        defaultValue={defaultValues.email}
        isRequired
        icon={<Mail size={14} />}
      />

      <div
        style={{
          background: 'rgba(0, 128, 128, 0.06)',
          border: '1px solid rgba(0, 128, 128, 0.15)',
          borderRadius: 'var(--radius-1)',
          padding: 'var(--space-3)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-color-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontWeight: 500,
            color: 'teal',
          }}
        >
          <Info size={13} />
          Password requirements
        </div>
        <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', lineHeight: 1.6 }}>
          <li>At least 8 characters long</li>
          <li>One uppercase letter</li>
          <li>One lowercase letter</li>
          <li>One digit</li>
          <li>One special character (@$!%*?&amp;)</li>
        </ul>
      </div>

      <TextField
        name="currentPassword"
        label="Current password"
        type="password"
        placeholder="Enter current password"
        icon={<Lock size={14} />}
      />

      <TextField
        name="newPassword"
        label="New password"
        type="password"
        placeholder="Enter new password"
        icon={<Lock size={14} />}
      />

      <TextField
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        placeholder="Confirm new password"
        icon={<Lock size={14} />}
      />
    </section>
  );
}

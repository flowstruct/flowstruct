import styles from './sidebar.module.css';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu';
import { ChevronsUpDown, Crown, Layers2, LogOut, User, FolderUp, Folder, Settings2 } from 'lucide-react';
import { Role } from '@/features/user/domain/user';
import { Popover } from '@/shared/components/ui/Popover';
import { getUserInitials } from '@/features/user/domain/getUserInitials';
import { useMatches, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { userQueries } from '@/features/user/queries';
import { userApi } from '@/features/user/api';
import { ProgressCircle } from '@/shared/components/ui/ProgressCircle';
import React from 'react';

const sidebarSections = [
  {
    items: [
      {
        icon: FolderUp,
        label: 'Generate site',
        route: '/site-generations',
      },
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
              data-active={isActive(item.route) || undefined}
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      queryClient.cancelQueries();
      navigate({ to: '/login', search: { redirect: '/' } });
    },
    meta: {
      invalidate: false,
    },
  });

  return (
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
          <MenuItem onPress={() => logout.mutate()} textValue="logout">
            <LogOut size={14} />
            <span>Log out</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

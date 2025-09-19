import styles from './sidebar.module.css';
import { UnstyledButton } from '@/shared/components/ui2/UnstyledButton.tsx';
import { useMe } from '@/features/user/hooks/useMe.ts';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui2/Menu.tsx';
import {
  Brush,
  ChevronsUpDown,
  Crown,
  Folder,
  Layers2,
  LogOut,
  Settings2,
  User,
} from 'lucide-react';
import { Role } from '@/features/user/types.ts';
import { Popover } from '@/shared/components/ui2/Popover.tsx';
import { getUserInitials } from '@/shared/utils/getUserInitials.ts';
import { useMatches, useNavigate } from '@tanstack/react-router';

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
  const { data: me } = useMe();

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

        <ChevronsUpDown className={styles.userProfileChevron} size={16} />
      </UnstyledButton>

      <Popover hideArrow>
        <Menu width={200}>
          <MenuItem textValue="Settings">
            <Settings2 size={16} />
            <span>Settings</span>
          </MenuItem>

          <MenuItem textValue="Settings">
            <LogOut size={16} />
            <span>Log out</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

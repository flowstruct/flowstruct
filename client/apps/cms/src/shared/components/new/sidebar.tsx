import styles from './sidebar.module.css';
import { ReactNode } from 'react';
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

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <UserProfile />

      <section className={styles.sidebarMenu}>
        <SidebarMenuItem>
          <Layers2 size={16} /> Flowsheets
        </SidebarMenuItem>

        <SidebarMenuSection header="Catalog">
          <SidebarMenuItem>
            <Folder size={16} /> Schools
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Folder size={16} /> Departments
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Folder size={16} /> Programs
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Folder size={16} /> Courses
          </SidebarMenuItem>
        </SidebarMenuSection>

        <SidebarMenuSection header="Admin">
          <SidebarMenuItem>
            <User size={16} /> Manage users
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Brush size={16} /> Style editor
          </SidebarMenuItem>
        </SidebarMenuSection>
      </section>

      <footer className={styles.footer}>
        <SidebarMenuItem>
          <Settings2 size={16} /> Settings
        </SidebarMenuItem>
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

type SidebarMenuSectionProps = {
  header: string;
  children: ReactNode;
};

function SidebarMenuSection({ header, children }: SidebarMenuSectionProps) {
  return (
    <section className={styles.sidebarMenuSection}>
      <h3>{header}</h3>
      {children}
    </section>
  );
}

type SideBarMenuItemsProps = {
  children: ReactNode;
};

function SidebarMenuItem({ children }: SideBarMenuItemsProps) {
  return <UnstyledButton className={styles.sidebarMenuItem}>{children}</UnstyledButton>;
}

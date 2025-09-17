import { useMe } from '@/features/user/hooks/useMe.ts';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui2/Menu.tsx';
import styles from './user-profile.module.css';
import { Role } from '@/features/user/types.ts';
import { ChevronsUpDown, LogOut, Settings2, User2 } from 'lucide-react';
import { Popover } from '@/shared/components/ui2/Popover.tsx';
import { Pressable } from 'react-aria';

export function UserProfile() {
  const { data: me } = useMe();

  return (
    <MenuTrigger>
      <Pressable>
        <section className={styles.userProfile}>
          <User2 />

          <div>
            <h1 className={styles.username}>{me.username}</h1>
            <p className={styles.role}>{Role[me.role as keyof typeof Role]}</p>
          </div>

          <ChevronsUpDown className={styles.chevron} size={16} />
        </section>
      </Pressable>

      <Popover hideArrow>
        <Menu width={225}>
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

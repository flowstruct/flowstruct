import { useMe } from '@/features/user/hooks/useMe.ts';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui2/Menu.tsx';
import styles from './user-profile.module.css';
import { Role } from '@/features/user/types.ts';
import { Button } from '@/shared/components/ui2/Button.tsx';
import { ChevronsUpDown, Settings2 } from 'lucide-react';
import { Popover } from '@/shared/components/ui2/Popover.tsx';

export function UserProfile() {
  const { data: me } = useMe();

  return (
    <MenuTrigger>
      <Button variant="transparent">
        <section className={styles.userProfile}>
          <div>
            <h1 className={styles.username}>{me.username}</h1>
            <p className={styles.role}>{Role[me.role as keyof typeof Role]}</p>
          </div>

          <ChevronsUpDown size={16} />
        </section>
      </Button>
      <Popover hideArrow>
        <Menu>
          <MenuItem>
            <Settings2 slot="icon" size={16} />
            <span slot="label">Settings</span>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

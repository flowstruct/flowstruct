import { UserProfile } from '@/shared/components/app-shell/sidebar/user-profile.tsx';
import styles from './index.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <UserProfile />
    </aside>
  );
}

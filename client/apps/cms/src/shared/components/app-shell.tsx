import { ReactNode } from 'react';
import { Sidebar } from '@/shared/components/sidebar';
import styles from './app-shell.module.css';

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div className={styles.appShell}>
      <Sidebar />

      <div className={styles.mainContainer}>
        <main>{children}</main>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import { Sidebar } from '@/shared/components/new/sidebar.tsx';
import styles from './app-shell.module.css';

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div className={styles.appShell}>
      <Sidebar />

      <main>{children}</main>
    </div>
  );
}

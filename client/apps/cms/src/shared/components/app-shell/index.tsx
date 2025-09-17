import { ReactNode } from 'react';
import { Sidebar } from '@/shared/components/app-shell/sidebar';
import styles from './index.module.css';

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

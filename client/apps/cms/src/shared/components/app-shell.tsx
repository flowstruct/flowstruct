import { ReactNode } from 'react';
import { Sidebar } from '@/shared/components/sidebar';
import { CollapsedSidebar } from '@/shared/components/collapsed-sidebar';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import styles from './app-shell.module.css';

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isCollapsed = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  return (
    <div className={styles.appShell}>
      {isDesktop && <Sidebar />}
      {isCollapsed && <CollapsedSidebar />}
      <main>{children}</main>
    </div>
  );
}

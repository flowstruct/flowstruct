import styles from '@/shared/components/data-table-toolbar.module.css';
import { ReactNode } from 'react';

type DataTableToolbarProps = {
  children: ReactNode;
};

export function DataTableToolbar({ children }: DataTableToolbarProps) {
  return <section className={styles.toolbar}>{children}</section>;
}

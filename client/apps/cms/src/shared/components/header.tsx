import { ReactNode } from 'react';
import styles from './header.module.css';
import clsx from 'clsx';

export function Header({ children }: { children?: ReactNode }) {
  return <header className={styles.header}>{children}</header>;
}

export function HeaderMain({ children }: { children?: ReactNode }) {
  return <div className={clsx(styles.headerSlot, styles.left)}>{children}</div>;
}

export function HeaderActions({ children }: { children: ReactNode }) {
  return <div className={clsx(styles.headerSlot, styles.right)}>{children}</div>;
}

export function HeaderTitle({ children }: { children: ReactNode }) {
  return <h1 className={styles.headerTitle}>{children}</h1>;
}

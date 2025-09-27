import { ReactNode } from 'react';
import styles from './header.module.css';
import clsx from 'clsx';

export function Header({ children }: { children?: ReactNode }) {
  return <header className={styles.header}>{children}</header>;
}

export function HeaderMain({ children }: { children?: ReactNode }) {
  return <div className={clsx(styles.headerSlot, styles.main)}>{children}</div>;
}

export function HeaderActions({ children }: { children: ReactNode }) {
  return <div className={clsx(styles.headerSlot, styles.actions)}>{children}</div>;
}

export function HeaderTitle({ children }: { children: ReactNode }) {
  return <h1 className={styles.title}>{children}</h1>;
}

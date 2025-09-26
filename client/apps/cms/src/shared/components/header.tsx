import React, { ReactNode } from 'react';
import styles from './header.module.css';
import clsx from 'clsx';

export function Header({ children }: { children?: ReactNode }) {
  return <header className={styles.header}>{children}</header>;
}

export function HeaderLeft({ children }: { children?: ReactNode }) {
  return <div className={clsx(styles.headerSlot, styles.left)}>{children}</div>;
}

export function HeaderRight({ children }: { children: ReactNode }) {
  return <div className={clsx(styles.headerSlot, styles.right)}>{children}</div>;
}

export function HeaderTitle({ children }: { children: ReactNode }) {
  return <h1 className={styles.headerTitle}>{children}</h1>;
}

export function Breadcrumb({ children, base = false }: { children: ReactNode; base?: boolean }) {
  return <li className={clsx(styles.breadcrumb, base && styles.baseBreadcrumb)}>{children}</li>;
}

export function Breadcrumbs({ children }: { children: ReactNode }) {
  const count = React.Children.count(children);

  return (
    <ol className={styles.breadcrumbs}>
      {React.Children.map(children, (child, i) => (
        <>
          {child}
          {i < count - 1 && <span className={styles.arrow}>›</span>}
        </>
      ))}
    </ol>
  );
}

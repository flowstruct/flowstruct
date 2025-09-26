import React, { ReactNode } from 'react';
import clsx from 'clsx';
import styles from '@/shared/components/breadcrumbs.module.css';

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

export function Breadcrumb({ children, base = false }: { children: ReactNode; base?: boolean }) {
  return <li className={clsx(styles.breadcrumb, base && styles.baseBreadcrumb)}>{children}</li>;
}

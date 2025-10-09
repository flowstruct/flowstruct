import React, { ReactNode } from 'react';
import clsx from 'clsx';
import '@/shared/components/ui/breadcrumbs.css';

export function Breadcrumbs({ children }: { children: ReactNode }) {
  const count = React.Children.count(children);

  return (
    <ol className="my-breadcrumbs">
      {React.Children.map(children, (child, i) => (
        <>
          {child}
          {i < count - 1 && <span className="my-breadcrumb-arrow">›</span>}
        </>
      ))}
    </ol>
  );
}

export function Breadcrumb({ children, base = false }: { children: ReactNode; base?: boolean }) {
  return <li className={clsx('my-breadcrumb', base && 'my-base-breadcrumb')}>{children}</li>;
}

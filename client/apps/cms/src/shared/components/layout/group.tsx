import React from 'react';
import clsx from 'clsx';
import styles from './layout.module.css';
import { Align, Gap, Justify } from '@/shared/components/layout/layout.ts';

export interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
  justify?: Justify;
  align?: Align;
  wrap?: boolean;
  className?: string;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function Group({
  gap = 2,
  justify,
  align = 'center',
  wrap = false,
  className,
  children,
  ...props
}: GroupProps) {
  const gapClass = styles[`gap${gap}`] ?? styles.gap4;
  const justifyClass = justify ? styles[`justify${cap(justify)}`] : undefined;
  const alignClass = align ? styles[`align${cap(align)}`] : undefined;
  const wrapClass = wrap ? styles.wrap : undefined;

  return (
    <div
      className={clsx(styles.group, gapClass, justifyClass, alignClass, wrapClass, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default Group;

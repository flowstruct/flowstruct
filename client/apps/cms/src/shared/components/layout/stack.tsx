import React from 'react';
import clsx from 'clsx';
import styles from './layout.module.css';
import { Align, Gap, Justify } from '@/shared/components/layout/layout';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
  justify?: Justify;
  align?: Align;
  className?: string;
  fill?: boolean;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Stack({
  gap = 2,
  justify,
  align,
  fill = false,
  className,
  children,
  ...props
}: StackProps) {
  const gapClass = styles[`gap${gap}`] ?? styles.gap4;
  const justifyClass = justify ? styles[`justify${cap(justify)}`] : undefined;
  const alignClass = align ? styles[`align${cap(align)}`] : undefined;
  const fillClass = fill ? styles['fillHeight'] : undefined;

  return (
    <div
      className={clsx(styles.stack, gapClass, justifyClass, alignClass, fillClass, className)}
      {...props}
    >
      {children}
    </div>
  );
}

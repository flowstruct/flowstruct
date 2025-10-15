import React from 'react';
import clsx from 'clsx';
import styles from './layout.module.css';
import { Align, Gap, Justify } from '@/shared/components/layout/layout.ts';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
  justify?: Justify;
  align?: Align;
  className?: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Stack({ gap = 4, justify, align, className, children, ...props }: StackProps) {
  const gapClass = styles[`gap${gap}`] ?? styles.gap4;
  const justifyClass = justify ? styles[`justify${cap(justify)}`] : undefined;
  const alignClass = align ? styles[`align${cap(align)}`] : undefined;

  return (
    <div className={clsx(styles.stack, gapClass, justifyClass, alignClass, className)} {...props}>
      {children}
    </div>
  );
}

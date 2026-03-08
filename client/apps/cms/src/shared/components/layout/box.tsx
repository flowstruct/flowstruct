import React from 'react';
import clsx from 'clsx';
import styles from './layout.module.css';
import { Space } from '@/shared/components/layout/layout';

export type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  p?: Space;
  px?: Space;
  py?: Space;
  pt?: Space;
  pr?: Space;
  pb?: Space;
  pl?: Space;
  withShadow?: boolean;
  withBorder?: boolean | 'soft';
  rounded?: boolean | 'sm' | 'md';
  position?: 'relative' | 'absolute';
  overflow?: 'auto' | 'hidden' | 'scroll' | 'visible';
  overflowX?: 'auto' | 'hidden' | 'scroll' | 'visible';
  overflowY?: 'auto' | 'hidden' | 'scroll' | 'visible';
  className?: string;
};

export function Box({
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  withShadow = false,
  withBorder = false,
  rounded = true,
  position,
  overflow,
  overflowX,
  overflowY,
  className,
  children,
  ...props
}: BoxProps) {
  const classes = [
    styles.uReset,
    p !== undefined && styles[`p${p}`],
    px !== undefined && styles[`px${px}`],
    py !== undefined && styles[`py${py}`],
    pt !== undefined && styles[`pt${pt}`],
    pr !== undefined && styles[`pr${pr}`],
    pb !== undefined && styles[`pb${pb}`],
    pl !== undefined && styles[`pl${pl}`],
    withBorder ? styles.withBorder : undefined,
    withShadow && styles.withShadow,
    rounded === true ? styles['rounded-sm'] : styles[`rounded-${rounded}`],
    position !== undefined && styles[`position-${position}`],
    overflow && styles[`overflow-${overflow}`],
    overflowX && styles[`overflow-x-${overflowX}`],
    overflowY && styles[`overflow-y-${overflowY}`],
    className,
  ];

  return (
    <div className={clsx(classes)} {...props}>
      {children}
    </div>
  );
}

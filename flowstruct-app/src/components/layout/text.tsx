import React, {type ElementType } from 'react';
import clsx from 'clsx';
import styles from './text.module.css';

type Size = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
type Weight = 'normal' | 'medium' | 'semibold' | 'bold';
type Tone = 'default' | 'secondary' | 'dimmed' | 'link' | 'primary' | 'invalid';
type Align = 'left' | 'center' | 'right' | 'justify';

export type TextProps = React.HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  size?: Size;
  weight?: Weight;
  tone?: Tone;
  align?: Align;
  truncate?: boolean;
  lineClamp?: number;
  inline?: boolean;
};

export function Text({
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  tone = 'default',
  align,
  truncate = false,
  lineClamp,
  inline = false,
  className,
  children,
  ...props
}: TextProps) {
  const clampClass = lineClamp && lineClamp > 0 ? styles['clamp'] : undefined;
  const clampLevel =
    lineClamp && lineClamp > 0 && lineClamp <= 6 ? styles[`clamp-${lineClamp}`] : undefined;

  return (
    <Component
      className={clsx(
        styles.text,
        styles[`size-${size}`],
        styles[`weight-${weight}`],
        styles[`tone-${tone}`],
        align && styles[`align-${align}`],
        inline ? styles.inline : styles.block,
        truncate && styles.truncate,
        clampClass,
        clampLevel,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

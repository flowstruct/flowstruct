import { Button as RACButton, ButtonProps as RACButtonProps } from 'react-aria-components';
import clsx from 'clsx';
import './Button.css';
import { ProgressCircle } from '@/shared/components/ui/ProgressCircle';

interface ButtonProps extends RACButtonProps {
  variant?: 'default' | 'transparent' | 'primary' | 'flat' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'none';
  shape?: 'button' | 'icon';
  showIndicator?: boolean;
  fullWidth?: boolean;
  theme?: 'danger' | 'normal';
  className?: string;
}

export function Button({
  size = 'md',
  variant = 'default',
  shape = 'button',
  showIndicator = false,
  fullWidth = false,
  theme = 'normal',
  className,
  isPending = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <RACButton
      {...props}
      data-variant={variant}
      data-size={size}
      data-theme={theme}
      data-show-indicator={showIndicator ? true : undefined}
      data-full-width={fullWidth ? true : undefined}
      data-shape={shape}
      className={clsx('react-aria-Button', className)}
      isPending={isPending}
    >
      {({ isPending }) => (
        <>
          {!isPending && children}
          {isPending && <ProgressCircle aria-label="Saving..." isIndeterminate />}
        </>
      )}
    </RACButton>
  );
}

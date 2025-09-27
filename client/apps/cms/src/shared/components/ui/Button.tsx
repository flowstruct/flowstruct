import { Button as RACButton, ButtonProps as RACButtonProps } from 'react-aria-components';
import clsx from 'clsx';
import './Button.css';

interface ButtonProps extends RACButtonProps {
  variant?: 'default' | 'transparent' | 'primary' | 'flat';
  size?: 'sm' | 'md' | 'icon';
  showIndicator?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  size = 'md',
  variant = 'default',
  showIndicator = false,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <RACButton
      {...props}
      data-variant={className ? undefined : variant}
      data-size={className ? undefined : size}
      data-show-indicator={showIndicator ? true : undefined}
      data-full-width={fullWidth ? true : undefined}
      className={clsx('react-aria-Button', className)}
    >
      {props.children}
    </RACButton>
  );
}

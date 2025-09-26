import { Button as RACButton, ButtonProps as RACButtonProps } from 'react-aria-components';
import styles from './Button.module.css';

interface ButtonProps extends RACButtonProps {
  variant?: 'default' | 'transparent' | 'primary' | 'icon' | 'flat' ;
  size?: 'sm' | 'md';
}

export function Button({ size = 'md', variant = 'default', ...props }: ButtonProps) {
  return (
    <RACButton {...props} data-variant={variant} data-size={size} className={styles.button}>
      {props.children}
    </RACButton>
  );
}

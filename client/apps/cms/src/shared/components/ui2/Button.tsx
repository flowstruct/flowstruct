import { Button as RACButton, ButtonProps as RACButtonProps } from 'react-aria-components';
import styles from './Button.module.css';

interface ButtonProps extends RACButtonProps {
  variant?: 'default' | 'transparent';
}

export function Button({ variant = 'default', ...props }: ButtonProps) {
  return (
    <RACButton {...props} data-variant={variant} className={styles.button}>
      {props.children}
    </RACButton>
  );
}

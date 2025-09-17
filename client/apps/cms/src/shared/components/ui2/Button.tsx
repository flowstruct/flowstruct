'use client';
import { Button as RACButton, ButtonProps as RACButtonProps } from 'react-aria-components';
import './Button.css';
import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends Omit<RACButtonProps, 'children'> {
  children?: React.ReactNode;
  variant?: 'default' | 'transparent';
}

export function Button({ children, variant, ...props }: ButtonProps) {
  return (
    <RACButton
      {...props}
      data-variant={variant}
      className={clsx('react-aria-Button', props.className)}
    >
      {children}
    </RACButton>
  );
}

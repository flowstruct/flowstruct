'use client';
import {
  Group,
  Input,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import { FieldError, Label } from './Form.tsx';
import { Text } from './Content.tsx';
import './TextField.css';
import React from 'react';

export interface TextFieldProps extends AriaTextFieldProps {
  width?: number;
  icon?: React.ReactNode;
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  variant?: 'default' | 'transparent';
  className?: string;
  size?: 'sm' | 'md' | 'xl';
}

export function TextField({
  width,
  icon,
  label,
  description,
  placeholder,
  errorMessage,
  className,
  size = 'sm',
  variant = 'default',
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      style={{ width: width ? '' : '100%' }}
      data-size={size}
      data-variant={variant}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <Group style={{ width: width ? '' : '100%' }}>
        {icon}
        <Input className={className} style={{ width: width ?? '' }} placeholder={placeholder} />
      </Group>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}

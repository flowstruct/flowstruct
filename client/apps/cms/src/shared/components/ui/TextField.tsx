'use client';
import {
  Group,
  Input,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from 'react-aria-components';
import { FieldError, Label } from './Form.tsx';
import { Text } from './Content.tsx';
import './TextField.css';
import React from 'react';

export interface TextFieldProps extends AriaTextFieldProps {
  icon?: React.ReactNode;
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  variant?: 'default' | 'transparent';
}

export function TextField({
  icon,
  label,
  description,
  placeholder,
  errorMessage,
  variant = 'default',
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField data-variant={variant} {...props}>
      {label && <Label>{label}</Label>}
      <Group>
        {icon}
        <Input placeholder={placeholder} />
      </Group>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaTextField>
  );
}

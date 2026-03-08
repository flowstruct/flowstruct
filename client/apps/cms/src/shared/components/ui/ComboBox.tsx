'use client';
import {
  ComboBox as AriaComboBox,
  ComboBoxProps as AriaComboBoxProps,
  Group,
  Input,
  ListBoxItemProps,
  ValidationResult,
} from 'react-aria-components';
import { FieldButton, FieldError, Label } from './Form';
import { Text } from './Content';
import { ListBoxItem } from './ListBox';
import { Popover } from './Popover';
import { ChevronDown } from 'lucide-react';

import './ComboBox.css';
import React from 'react';

export interface ComboBoxProps<T extends object> extends Omit<AriaComboBoxProps<T>, 'children'> {
  label?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'transparent';
  size?: 'sm' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function ComboBox<T extends object>({
  label,
  description,
  placeholder = 'Select an item',
  errorMessage,
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}: ComboBoxProps<T>) {
  return (
    <AriaComboBox data-size={size} data-variant={variant} {...props}>
      <Label>{label}</Label>
      <Group>
        <Input placeholder={placeholder} />
        <FieldButton>
          <ChevronDown size={15} />
        </FieldButton>
      </Group>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
      <Popover hideArrow>{children}</Popover>
    </AriaComboBox>
  );
}

export function ComboBoxItem(props: ListBoxItemProps) {
  return <ListBoxItem {...props} />;
}

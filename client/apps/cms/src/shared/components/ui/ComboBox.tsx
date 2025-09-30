'use client';
import {
  ComboBox as AriaComboBox,
  ComboBoxProps as AriaComboBoxProps,
  Input,
  ListBoxItemProps,
  ValidationResult,
} from 'react-aria-components';
import { FieldButton, FieldError, Label } from './Form.tsx';
import { Text } from './Content.tsx';
import { ListBox, ListBoxItem } from './ListBox.tsx';
import { Popover } from './Popover.tsx';
import { ChevronDown } from 'lucide-react';

import './ComboBox.css';
import React from 'react';

export interface ComboBoxProps<T extends object> extends Omit<AriaComboBoxProps<T>, 'children'> {
  label?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  className?: string;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function ComboBox<T extends object>({
  label,
  description,
  placeholder = 'Select an item',
  errorMessage,
  className,
  children,
  ...props
}: ComboBoxProps<T>) {
  return (
    <AriaComboBox className={className} {...props}>
      <Label>{label}</Label>
      <div>
        <Input placeholder={placeholder} />
        <FieldButton>
          <ChevronDown size={16} />
        </FieldButton>
      </div>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
      <Popover hideArrow>
        <ListBox>{children}</ListBox>
      </Popover>
    </AriaComboBox>
  );
}

export function ComboBoxItem(props: ListBoxItemProps) {
  return <ListBoxItem {...props} />;
}

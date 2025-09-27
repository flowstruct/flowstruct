'use client';
import {
  ListBoxItemProps,
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  SelectValue,
  ValidationResult,
  Button
} from 'react-aria-components';
import { ListBox, ListBoxItem } from './ListBox.tsx';
import { ChevronDown } from 'lucide-react';
import { Popover } from './Popover.tsx';
import { Text } from './Content.tsx';
import { FieldError, Label } from './Form.tsx';
import './Select.css';
import React from 'react';

export interface SelectProps<T extends object> extends Omit<AriaSelectProps<T>, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect {...props}>
      <Label>{label}</Label>
      <Button>
        <SelectValue />
        <span aria-hidden="true">
          <ChevronDown size={16} />
        </span>
      </Button>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
      <Popover hideArrow>
        <ListBox items={items}>{children}</ListBox>
      </Popover>
    </AriaSelect>
  );
}

export function SelectItem(props: ListBoxItemProps) {
  return <ListBoxItem {...props} />;
}

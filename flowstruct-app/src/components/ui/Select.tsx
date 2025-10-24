'use client';
import {
  Button,
  type ListBoxItemProps,
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue,
  type ValidationResult,
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
  size?: 'xs' | 'sm';
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object>({
  label,
  size = 'sm',
  description,
  errorMessage,
  children,
  items,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect data-size={size} {...props}>
      {label && <Label>{label}</Label>}
      <Button>
        <SelectValue />

        <span aria-hidden="true">
          <ChevronDown size={15} />
        </span>
      </Button>

      {description && <Text slot="description">{description}</Text>}

      <FieldError>{errorMessage}</FieldError>

      <Popover hideArrow>
        <ListBox size={size} items={items}>
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export function SelectItem(props: ListBoxItemProps) {
  return <ListBoxItem {...props} />;
}

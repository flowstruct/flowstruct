'use client';
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxItemProps,
  ListBoxProps as RACListBoxProps,
} from 'react-aria-components';

import './ListBox.css';
import React from 'react';

interface ListBoxProps<T> extends RACListBoxProps<T> {
  size?: 'xs' | 'sm';
}

export function ListBox<T extends object>({ size = 'sm', children, ...props }: ListBoxProps<T>) {
  return (
    <AriaListBox data-size={size} {...props}>
      {children}
    </AriaListBox>
  );
}

export function ListBoxItem(props: ListBoxItemProps) {
  return <AriaListBoxItem {...props} />;
}

export function ListEmptyState({
  children = 'No results.',
}: {
  children?: React.ReactNode | string;
}) {
  return <div className="my-ListBox-empty-state">{children}</div>;
}

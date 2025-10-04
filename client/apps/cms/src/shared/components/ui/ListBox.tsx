'use client';
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxItemProps,
  ListBoxProps,
} from 'react-aria-components';

import './ListBox.css';
import React from 'react';

export function ListBox<T extends object>({ children, ...props }: ListBoxProps<T>) {
  return <AriaListBox {...props}>{children}</AriaListBox>;
}

export function ListBoxItem(props: ListBoxItemProps) {
  return <AriaListBoxItem {...props} />;
}

export function ListEmptyState({
  children = 'No results.',
}: {
  children?: React.ReactNode | string;
}) {
  return <p className="my-ListBox-empty-state">{children}</p>;
}

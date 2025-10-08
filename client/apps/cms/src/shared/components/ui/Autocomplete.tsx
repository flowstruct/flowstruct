import {
  Autocomplete as AriaAutocomplete,
  AutocompleteProps as AriaAutocompleteProps,
  Key,
  useFilter,
} from 'react-aria-components';
import { SearchField } from './SearchField.tsx';

import './Autocomplete.css';
import React from 'react';

export interface AutocompleteProps<T extends object>
  extends Omit<AriaAutocompleteProps, 'children'> {
  isLoading?: boolean;
  label?: string;
  placeholder?: string;
  items?: Iterable<T>;
  children: React.ReactNode;
  onAction?: (id: Key) => void;
}

export function Autocomplete<T extends object>({
  label,
  isLoading = false,
  placeholder = 'Find...',
  items,
  children,
  onAction,
  ...props
}: AutocompleteProps<T>) {
  let { contains } = useFilter({ sensitivity: 'base' });
  return (
    <div className="my-autocomplete">
      <AriaAutocomplete filter={contains} {...props}>
        <SearchField
          aria-label="Search items"
          autoFocus
          label={label}
          isLoading={isLoading}
          placeholder={placeholder}
        />
        {children}
      </AriaAutocomplete>
    </div>
  );
}

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
  label?: string;
  placeholder?: string;
  items?: Iterable<T>;
  children: React.ReactNode;
  onAction?: (id: Key) => void;
}

export function Autocomplete<T extends object>({
  label,
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
        <SearchField aria-label="Search items" autoFocus label={label} placeholder={placeholder} />
        {children}
      </AriaAutocomplete>
    </div>
  );
}

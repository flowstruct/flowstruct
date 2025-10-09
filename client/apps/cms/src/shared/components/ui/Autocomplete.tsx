import {
  Autocomplete as AriaAutocomplete,
  AutocompleteProps as AriaAutocompleteProps,
  Key,
} from 'react-aria-components';

import './Autocomplete.css';
import React from 'react';

export interface AutocompleteProps extends Omit<AriaAutocompleteProps, 'children'> {
  children: React.ReactNode;
  onAction?: (id: Key) => void;
}

export function Autocomplete({ children, onAction, ...props }: AutocompleteProps) {
  return (
    <div className="my-autocomplete">
      <AriaAutocomplete {...props}>{children}</AriaAutocomplete>
    </div>
  );
}

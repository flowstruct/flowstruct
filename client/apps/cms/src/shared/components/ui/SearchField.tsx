import {
  Button,
  Input,
  SearchField as AriaSearchField,
  SearchFieldProps as AriaSearchFieldProps,
  ValidationResult,
} from 'react-aria-components';
import { FieldError, Label } from './Form.tsx';
import { Text } from './Content.tsx';
import { X } from 'lucide-react';
import './SearchField.css';
import React from 'react';

export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  icon?: React.ReactNode;
}

export function SearchField({
  label,
  description,
  errorMessage,
  placeholder = 'Search...',
  icon,
  ...props
}: SearchFieldProps) {
  return (
    <AriaSearchField {...props}>
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
      <Button>
        <X size={14} />
      </Button>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaSearchField>
  );
}

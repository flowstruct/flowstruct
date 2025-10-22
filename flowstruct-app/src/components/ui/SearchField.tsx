import {
  Button,
  Group,
  Input,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import { FieldError, Label } from './Form.tsx';
import { Text } from './Content.tsx';
import { X } from 'lucide-react';
import './SearchField.css';
import React from 'react';
import {ProgressCircle} from "./ProgressCircle.tsx";

export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function SearchField({
  label,
  isLoading = false,
  description,
  errorMessage,
  placeholder = 'Search...',
  icon,
  ...props
}: SearchFieldProps) {
  return (
    <AriaSearchField {...props}>
      {label && <Label>{label}</Label>}
      <Group>
        {icon && <div slot="icon">{icon}</div>}
        <Input slot="input" placeholder={placeholder} />

        <Group slot="right">
          {isLoading && <ProgressCircle slot="clear" />}
          <Button slot="clear">
            <X size={14} />
          </Button>
        </Group>
      </Group>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaSearchField>
  );
}

import React from 'react';

import './native-select.css';
import { FieldError, Label } from '@/shared/components/ui/Form';
import { Text } from '@/shared/components/ui/Content';

interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  children: React.ReactNode;
}

export function NativeSelect({
  label,
  placeholder,
  description,
  errorMessage,
  children,
  ...props
}: NativeSelectProps) {
  return (
    <div className="native-select-wrapper">
      {label && <Label>{label}</Label>}
      <select {...props}>
        {placeholder && (
          <option slot="placeholder" value="">
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <FieldError>{errorMessage}</FieldError>
      {description && <Text slot="description">{description}</Text>}
    </div>
  );
}

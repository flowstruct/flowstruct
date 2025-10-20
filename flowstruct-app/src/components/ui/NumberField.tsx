'use client';
import {
  Button,
  Group,
  Input,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
  ValidationResult,
} from 'react-aria-components';
import { FieldError, Label } from './Form.tsx';
import { Text } from './Content.tsx';
import './NumberField.css';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  icon?: React.ReactNode;
}

export function NumberField({
  label,
  description,
  errorMessage,
  icon,
  ...props
}: NumberFieldProps) {
  return (
    <AriaNumberField {...props}>
      <Label>{label}</Label>
      <Group>
        {icon}
        <Input />
        <div className="my-stepper-buttons">
          <Button slot="increment">
            <ChevronUp size={12} />
          </Button>
          <Button slot="decrement">
            <ChevronDown size={12} />
          </Button>
        </div>
      </Group>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaNumberField>
  );
}

'use client';
import {
  Group,
  Input,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
  ValidationResult,
} from 'react-aria-components';
import { Minus, Plus } from 'lucide-react';
import { FieldError, Label } from './Form.tsx';
import { Text } from './Content.tsx';
import './NumberField.css';
import { Button } from '@/shared/components/ui/Button.tsx';

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function NumberField({ label, description, errorMessage, ...props }: NumberFieldProps) {
  return (
    <AriaNumberField {...props}>
      <Label>{label}</Label>
      <Group>
        <Button variant="transparent" size="sm" slot="decrement">
          <Minus size={14} />
        </Button>
        <Input />
        <Button variant="transparent" size="sm" slot="increment">
          <Plus size={14} />
        </Button>
      </Group>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaNumberField>
  );
}

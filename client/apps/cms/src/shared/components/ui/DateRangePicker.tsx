'use client';
import {
  DateRangePicker as AriaDateRangePicker,
  DateRangePickerProps as AriaDateRangePickerProps,
  DateValue,
  Group,
  ValidationResult
} from 'react-aria-components';
import {DateInput, DateSegment} from './DateField.tsx';
import {FieldButton} from './Form.tsx';
import {Popover} from './Popover.tsx';
import {Label, FieldError} from './Form.tsx';
import {Text} from './Content.tsx';
import {RangeCalendar} from './RangeCalendar.tsx';
import {ChevronDown} from 'lucide-react';
import './DateRangePicker.css';

export interface DateRangePickerProps<T extends DateValue>
  extends AriaDateRangePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DateRangePicker<T extends DateValue>(
  { label, description, errorMessage, firstDayOfWeek, ...props }:
    DateRangePickerProps<T>
) {
  return (
    (
      <AriaDateRangePicker {...props}>
        <Label>{label}</Label>
        <Group>
          <DateInput slot="start">
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <span aria-hidden="true">–</span>
          <DateInput slot="end">
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <FieldButton><ChevronDown size={16} /></FieldButton>
        </Group>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
        <Popover hideArrow>
          <RangeCalendar firstDayOfWeek={firstDayOfWeek} />
        </Popover>
      </AriaDateRangePicker>
    )
  );
}

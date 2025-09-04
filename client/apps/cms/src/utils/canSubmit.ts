import { FieldValues, UseFormReturn } from 'react-hook-form';

export const canSubmit = <T extends FieldValues = FieldValues>(form: UseFormReturn<T>) =>
  form.formState.isValid && form.formState.isDirty;

import { NumberField } from '@/shared/components/ui/NumberField';
import { TextField } from '@/shared/components/ui/TextField';
import { Switch } from '@/shared/components/ui/Switch';
import { CalendarDays, Tag } from 'lucide-react';
import styles from './flowsheet-form-fields.module.css';
import { ProgramComboBox } from '@/features/flowsheet/components/program-combobox';
import { DisclosureState } from '@/shared/types';

export type FlowsheetFormFieldsProps = {
  programFormState: DisclosureState;
  defaultValues?: {
    program?: number;
    year?: number;
    name?: string;
  };
  disableProgram?: boolean;
};

export function FlowsheetFormFields({
  disableProgram,
  programFormState,
  defaultValues,
}: FlowsheetFormFieldsProps) {
  return (
    <section className={styles.form}>
      <section className={styles.programAndName}>
        <ProgramComboBox
          isDisabled={disableProgram}
          programFormState={programFormState}
          defaultProgramId={defaultValues?.program}
        />

        <TextField
          name="name"
          aria-label="Flowsheet name"
          autoComplete="off"
          icon={<Tag size={14} />}
          variant="transparent"
          placeholder="Enter an optional name (e.g., General, Data Science, Cybersecurity)"
          defaultValue={defaultValues?.name}
        />
      </section>

      <div className={styles.flowsheetProperties}>
        <NumberField
          minValue={2005}
          name="year"
          aria-label="Flowsheet year"
          isRequired
          formatOptions={{
            useGrouping: false,
          }}
          icon={<CalendarDays size={15} />}
          defaultValue={defaultValues?.year ?? new Date().getFullYear()}
        />
      </div>
    </section>
  );
}

export function NavigateToFlowsheetSwitch({ value, onChange }) {
  return (
    <Switch isSelected={value} onChange={onChange}>
      Open after creating
    </Switch>
  );
}


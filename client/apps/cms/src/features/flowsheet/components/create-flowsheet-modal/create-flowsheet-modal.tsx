import { NumberField } from '@/shared/components/ui/NumberField';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/shared/components/ui/Button';
import { CalendarDays, Grid2X2, Layers2, Plus, Tag } from 'lucide-react';
import styles from './create-flowsheet-modal.module.css';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { TextField } from '@/shared/components/ui/TextField';
import { Switch } from '@/shared/components/ui/Switch';
import { flowsheetApi } from '@/features/flowsheet/api';
import { useDisclosure } from '@/shared/hooks/use-disclosure';
import { ProgramComboBox } from '@/features/flowsheet/components/create-flowsheet-modal/program-combobox';
import {
  FormModal,
  FormModalBody,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
  FormModalTrigger,
} from '@/shared/components/form-modal';
import { Flowsheet } from '@/features/flowsheet/domain/flowsheet';
import { DisclosureState } from '@/shared/types';
import React from 'react';
import { useNavigate } from '@tanstack/react-router';

type FlowsheetFormFieldsProps = {
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

export function CreateFlowsheetModal() {
  const programFormState = useDisclosure();
  const [navigateAfter, setNavigateAfter] = React.useState(true);
  const navigate = useNavigate();

  const createFlowsheet = useMutation({
    mutationFn: flowsheetApi.createFlowsheet,
    meta: { successMessage: 'Flowsheet created.' },
  });

  return (
    <FormModal
      size="md"
      onSubmit={(data) => {
        if (programFormState.isOpen) return;
        return createFlowsheet.mutate(data as Partial<Flowsheet>, {
          onSuccess: (result: Flowsheet) => {
            if (navigateAfter) {
              navigate({
                to: '/flowsheets/$flowsheetId',
                params: { flowsheetId: String(result.id) },
              });
            }
          },
        });
      }}
    >
      <FormModalTrigger>
        <Button size="sm" variant="transparent">
          <Plus size={15} />
        </Button>
      </FormModalTrigger>

      <FormModalBody>
        <FormModalHeader>
          <Breadcrumbs>
            <Breadcrumb base>
              <Layers2 size={15} /> Flowsheets
            </Breadcrumb>

            <Breadcrumb>
              <Grid2X2 size={15} color="teal" /> New flowsheet
            </Breadcrumb>
          </Breadcrumbs>
        </FormModalHeader>

        <FlowsheetFormFields programFormState={programFormState} />
      </FormModalBody>

      <FormModalFooter>
        <NavigateToFlowsheetSwitch value={navigateAfter} onChange={setNavigateAfter} />

        <FormModalSubmit isPending={createFlowsheet.isPending}>
          <Grid2X2 size={15} /> Create
        </FormModalSubmit>
      </FormModalFooter>
    </FormModal>
  );
}

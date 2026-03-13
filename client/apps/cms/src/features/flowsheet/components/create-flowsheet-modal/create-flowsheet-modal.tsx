import { NumberField } from '@/shared/components/ui/NumberField';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { CalendarDays, Grid2X2, Layers2, Plus, Tag } from 'lucide-react';
import styles from './create-flowsheet-modal.module.css';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs';
import { TextField } from '@/shared/components/ui/TextField';
import { Switch } from '@/shared/components/ui/Switch';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip';
import { flowsheetApi } from '@/features/flowsheet/api';
import { useNavigate } from '@tanstack/react-router';
import { useDisclosure } from '@/shared/hooks/use-disclosure';
import { ProgramComboBox } from '@/features/flowsheet/components/create-flowsheet-modal/program-combobox';
import {
  FormModal,
  FormModalBody,
  FormModalContent,
  FormModalFooter,
  FormModalHeader,
  FormModalSubmit,
  useFormModalContext,
} from '@/shared/components/form-modal';
import { Flowsheet } from '@/features/flowsheet/domain/flowsheet';
import { DisclosureState } from '@/shared/types';

type FlowsheetFormFieldsProps = {
  programFormState: DisclosureState;
  defaultValues?: {
    program?: number;
    year?: number;
    name?: string;
  };
};

export function FlowsheetFormFields({ programFormState, defaultValues }: FlowsheetFormFieldsProps) {
  return (
    <section className={styles.form}>
      <section className={styles.programAndName}>
        <ProgramComboBox
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

export function NavigateToFlowsheetSwitch() {
  const { registerOnSuccess } = useFormModalContext();
  const [navigateAfter, setNavigateAfter] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    registerOnSuccess((result) => {
      if (navigateAfter) {
        navigate({
          to: '/flowsheets/$flowsheetId',
          params: { flowsheetId: String(result.id) },
        });
      }
    });
  }, [navigateAfter, registerOnSuccess, navigate]);

  return (
    <Switch isSelected={navigateAfter} onChange={setNavigateAfter}>
      Open after creating
    </Switch>
  );
}

export function CreateFlowsheetModal() {
  const programFormState = useDisclosure();

  const createFlowsheet = useMutation({
    mutationFn: flowsheetApi.createFlowsheet,
    meta: { successMessage: 'Flowsheet created.' },
  });

  return (
    <FormModal
      onSubmit={(data) => {
        if (programFormState.isOpen) return;
        return createFlowsheet.mutateAsync(data as Partial<Flowsheet>) as Promise<{
          id: number;
        }>;
      }}
      isPending={createFlowsheet.isPending}
    >
      <CreateFlowsheetButton />

      <FormModalContent>
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
          <NavigateToFlowsheetSwitch />
          <FormModalSubmit>
            <Grid2X2 size={15} /> Create flowsheet
          </FormModalSubmit>
        </FormModalFooter>
      </FormModalContent>
    </FormModal>
  );
}

function CreateFlowsheetButton() {
  const { open } = useFormModalContext();

  return (
    <TooltipTrigger>
      <Button onPress={open} size="sm" variant="transparent">
        <Plus size={15} />
      </Button>

      <Tooltip>New</Tooltip>
    </TooltipTrigger>
  );
}

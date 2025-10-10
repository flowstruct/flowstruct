import { DisclosureState } from '@/shared/types.ts';
import { ComboBoxState } from '@/shared/hooks/use-combobox-state.ts';
import { Degree, Program } from '@/features/program/domain/program.ts';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { programApi } from '@/features/program/api.ts';
import { handleSubmit } from '@/shared/utils/handle-submit.ts';
import { Form } from '@/shared/components/ui/Form.tsx';
import styles from '@/features/flowsheet/components/create-flowsheet-modal/create-program-form.module.css';
import { TextField } from '@/shared/components/ui/TextField.tsx';
import { ChevronLeft, GraduationCap, Hash, Tag } from 'lucide-react';
import { Select, SelectItem } from '@/shared/components/ui/Select.tsx';
import { Divider } from '@/shared/components/ui/divider.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Switch } from '@/shared/components/ui/Switch.tsx';

export function CreateProgramForm({
  programFormState,
  programComboboxState,
}: {
  programFormState: DisclosureState;
  programComboboxState: ComboBoxState<Program>;
}) {
  const [selectProgram, setSelectProgram] = React.useState<boolean>(true);

  const createProgram = useMutation({
    mutationFn: programApi.createProgram,
  });

  const onSubmit = handleSubmit((formData) => {
    createProgram.mutate(formData, {
      onSuccess: (data) => {
        if (selectProgram) {
          programComboboxState.onCreateItem(data);
        }

        programFormState.close();
      },
    });
  });

  return (
    <Form id="program-form" onSubmit={onSubmit}>
      <div className={styles.programFormFields}>
        <TextField
          autoFocus
          placeholder="A unique identifier (MECH, CS, MGT, etc.)..."
          isRequired
          icon={<Hash size={15} />}
          name="code"
          label="Code"
        />

        <TextField isRequired icon={<Tag size={15} />} name="name" label="Name" />

        <Select
          isRequired
          items={Object.entries(Degree).map(([k, v]) => ({ id: k, name: v }))}
          placeholder="Pick a degree"
          label="Degree"
          name="degree"
        >
          {(item) => <SelectItem>{item.name}</SelectItem>}
        </Select>
      </div>

      <Divider />

      <footer className={styles.programFormFooter}>
        <Button size="sm" variant="transparent" type="reset" onPress={programFormState.close}>
          <ChevronLeft size={14} /> Cancel
        </Button>

        <div className={styles.programFormSubmit}>
          <Switch isSelected={selectProgram} onChange={setSelectProgram}>
            Select after creating
          </Switch>

          <Button
            size="sm"
            variant="primary"
            type="submit"
            form="program-form"
            isPending={createProgram.isPending}
          >
            <GraduationCap size={15} /> Create program
          </Button>
        </div>
      </footer>
    </Form>
  );
}

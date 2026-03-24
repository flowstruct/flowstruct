import { DisclosureState } from '@/shared/types';
import React from 'react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries';
import { ComboBoxState, useComboBoxState } from '@/shared/hooks/use-combobox-state';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName';
import { ComboBox } from '@/shared/components/ui/ComboBox';
import { ListBox, ListBoxItem, ListEmptyState } from '@/shared/components/ui/ListBox';
import styles from '@/features/flowsheet/components/create-flowsheet-modal/program-combobox.module.css';
import { createPortal } from 'react-dom';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';
import { Program } from '@/features/program/domain/program';
import { programApi } from '@/features/program/api';
import { handleSubmit } from '@/shared/utils/handle-submit';
import { ProgramFormFields } from '@/features/program/components/program-form-fields';
import { Form } from '@/shared/components/ui/Form';
import { Divider } from '@/shared/components/ui/divider';
import { Button } from '@/shared/components/ui/Button';
import { ChevronLeft, GraduationCap } from 'lucide-react';
import { Switch } from '@/shared/components/ui/Switch';

type ProgramComboBoxProps = {
  isDisabled?: boolean;
  programFormState: DisclosureState;
  defaultProgramId?: number;
};

export function ProgramComboBox({
  isDisabled = false,
  programFormState,
  defaultProgramId,
}: ProgramComboBoxProps) {
  const { data: programs } = useSuspenseQuery(programQueries.collection);
  const comboBoxState = useComboBoxState({
    items: programs.byIds,
    getDisplayName: getProgramDisplayName,
    defaultKey: defaultProgramId,
  });
  const programFormRef = React.useRef<HTMLDivElement>(null);

  const suggestCreateProgram =
    comboBoxState.filteredItems.length !== 0 &&
    comboBoxState.inputValue !== '' &&
    !comboBoxState.selectedKey;

  const createProgramButton = (
    <UnstyledButton
      aria-label="Create program"
      onPress={programFormState.open}
      className={styles.createProgramButton}
    >
      {comboBoxState.inputValue ? `Create “${comboBoxState.inputValue}”` : 'Create program'}
    </UnstyledButton>
  );

  return (
    <>
      <ComboBox
        isDisabled={isDisabled}
        name="program"
        aria-label="Flowsheet program"
        size="lg"
        variant="transparent"
        isRequired
        autoFocus
        formValue="key"
        placeholder="Pick a program"
        allowsEmptyCollection
        inputValue={comboBoxState.inputValue}
        onInputChange={comboBoxState.onInputChange}
        value={comboBoxState.selectedKey}
        onChange={comboBoxState.onSelectionChange}
        onOpenChange={(isOpen) => {
          if (isOpen && programFormState.isOpen) programFormState.close();
        }}
      >
        {!programFormState.isOpen && (
          <>
            <ListBox
              items={comboBoxState.filteredItems}
              renderEmptyState={() => <ListEmptyState>{createProgramButton}</ListEmptyState>}
            >
              {(item) => (
                <ListBoxItem key={item.id} textValue={getProgramDisplayName(item)}>
                  {getProgramDisplayName(item)}
                </ListBoxItem>
              )}
            </ListBox>

            {suggestCreateProgram && (
              <section className={styles.createHint}>
                Can't find what you're looking for?
                {createProgramButton}
              </section>
            )}
          </>
        )}

        <div ref={programFormRef} />
      </ComboBox>

      {programFormState.isOpen &&
        programFormRef.current &&
        createPortal(
          <CreateProgramForm
            programFormState={programFormState}
            programComboboxState={comboBoxState}
          />,
          programFormRef.current
        )}
    </>
  );
}

function CreateProgramForm({
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

  const onSubmit = handleSubmit((formData, e) => {
    e.stopPropagation();

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
        <ProgramFormFields />
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

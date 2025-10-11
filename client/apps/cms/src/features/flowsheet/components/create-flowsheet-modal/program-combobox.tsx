import { DisclosureState } from '@/shared/types.ts';
import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries.ts';
import { useComboBoxState } from '@/shared/hooks/use-combobox-state.ts';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import { ComboBox } from '@/shared/components/ui/ComboBox.tsx';
import { ListBox, ListBoxItem, ListEmptyState } from '@/shared/components/ui/ListBox.tsx';
import styles from '@/features/flowsheet/components/create-flowsheet-modal/program-combobox.module.css';
import { createPortal } from 'react-dom';
import { CreateProgramForm } from './create-program-form';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton.tsx';

type ProgramComboBoxProps = {
  programFormState: DisclosureState;
};

export function ProgramComboBox({ programFormState }: ProgramComboBoxProps) {
  const { data: programs } = useSuspenseQuery(programQueries.collection);
  const comboBoxState = useComboBoxState({
    items: programs.byIds,
    getDisplayName: getProgramDisplayName,
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
        selectedKey={comboBoxState.selectedKey}
        onSelectionChange={comboBoxState.onSelectionChange}
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

import { Form } from '@/shared/components/ui/Form.tsx';
import { NumberField } from '@/shared/components/ui/NumberField.tsx';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries.ts';
import React from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Modal } from '@/shared/components/ui/Modal.tsx';
import { Button } from '@/shared/components/ui/Button';
import { CalendarDays, GraduationCap, Grid2X2, Hash, Layers2, Plus, Tag, X } from 'lucide-react';
import styles from './create-flowsheet-form.module.css';
import { ComboBox } from '@/shared/components/ui/ComboBox.tsx';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/breadcrumbs.tsx';
import { TextField } from '@/shared/components/ui/TextField.tsx';
import { Divider } from '@/shared/components/ui/divider.tsx';
import { Degree, Program } from '@/features/program/domain/program.ts';
import { Switch } from '@/shared/components/ui/Switch.tsx';
import { ListBox, ListBoxEmptyState, ListBoxItem } from '@/shared/components/ui/ListBox.tsx';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import { programApi } from '@/features/program/api.ts';
import { Select, SelectItem } from '@/shared/components/ui/Select.tsx';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { Key } from 'react-aria-components';
import { flowsheetApi } from '@/features/flowsheet/api.ts';

export function CreateFlowsheetForm() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const createFlowsheet = useMutation({
    mutationFn: flowsheetApi.createFlowsheet,
    meta: { successMessage: 'Flowsheet created.' },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    let data = Object.fromEntries(new FormData(e.currentTarget));

    console.log(e.isPropagationStopped());

    createFlowsheet.mutate(
      { ...data, duration: 1 },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <DialogTrigger>
      <Button onPress={() => setIsOpen(true)} size="sm" variant="primary">
        <Plus size={15} /> New
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="xl">
        <Dialog>
          <Form onSubmit={onSubmit}>
            <div className={styles.dialog}>
              <header className={styles.header}>
                <Breadcrumbs>
                  <Breadcrumb base>
                    <Layers2 size={15} /> Flowsheets
                  </Breadcrumb>

                  <Breadcrumb>
                    <Grid2X2 size={15} color="teal" /> New flowsheet
                  </Breadcrumb>
                </Breadcrumbs>

                <Button variant="transparent" size="icon" slot="close">
                  <X size={14} />
                </Button>
              </header>

              <section className={styles.form}>
                <section className={styles.programAndName}>
                  <ProgramComboBox />

                  <TextField
                    name="track"
                    aria-label="Flowsheet name"
                    icon={<Tag size={14} />}
                    variant="transparent"
                    placeholder="Enter an optional name (e.g., General, Data Science, Cybersecurity)"
                  />
                </section>

                <NumberField
                  name="year"
                  aria-label="Flowsheet year"
                  isRequired
                  formatOptions={{
                    useGrouping: false,
                  }}
                  icon={<CalendarDays size={15} />}
                  defaultValue={new Date().getFullYear()}
                />
              </section>

              <Divider />

              <section className={styles.footer}>
                <Button isPending={createFlowsheet.isPending} variant="primary" type="submit">
                  <Grid2X2 size={15} /> Create flowsheet
                </Button>
              </section>
            </div>
          </Form>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}

function ProgramComboBox() {
  const [input, setInput] = React.useState<string | undefined>(undefined);
  const [programFormOpen, setProgramFormOpen] = React.useState<boolean>(false);
  const [selectedKey, setSelectedKey] = React.useState<Key | null>(null);
  const programFormRef = React.useRef<HTMLDivElement>(null);

  const { data: programs } = useSuspenseQuery(programQueries.collection);

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
        // inputValue={input}
        // onInputChange={setInput}
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
        onOpenChange={(isOpen) => {
          if (isOpen && programFormOpen) {
            setProgramFormOpen(false);
          }
        }}
      >
        <ListBox
          renderEmptyState={() => (
            <ListBoxEmptyState label="No programs found. Create a new one below." />
          )}
          items={programs.list}
        >
          {(item) => {
            const name = getProgramDisplayName(item);

            return (
              <ListBoxItem key={item.id} textValue={name}>
                {name}
              </ListBoxItem>
            );
          }}
        </ListBox>

        <section className={styles.createProgramSection} ref={programFormRef}>
          {!programFormOpen && (
            <TooltipTrigger>
              <Button
                aria-label="Create program"
                onPress={() => setProgramFormOpen(true)}
                className={styles.createProgramButton}
              >
                <Plus size={15} />
              </Button>
              <Tooltip>Create program</Tooltip>
            </TooltipTrigger>
          )}
        </section>
      </ComboBox>

      {programFormOpen &&
        programFormRef.current &&
        createPortal(
          <CreateProgramForm
            closeForm={() => setProgramFormOpen(false)}
            onProgramCreated={(program) => {
              setSelectedKey(program.id);
              // setInput(getProgramDisplayName(program));
            }}
          />,
          programFormRef.current
        )}
    </>
  );
}

function CreateProgramForm({
  closeForm,
  onProgramCreated,
}: {
  closeForm: () => void;
  onProgramCreated: (program: Program) => void;
}) {
  const [selectOnCreate, setSelectOnCreate] = React.useState<boolean>(true);

  const createProgram = useMutation({
    mutationFn: programApi.createProgram,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    createProgram.mutate(data, {
      onSuccess: (data) => {
        if (selectOnCreate) {
          onProgramCreated(data);
        }
        closeForm();
      },
    });
  };

  return (
    <div className={styles.programForm}>
      <Form id="program-form" onSubmit={handleSubmit}>
        <div className={styles.programFormCodeAndName}>
          <TextField autoFocus width={75} icon={<Hash size={15} />} name="code" label="Code" />
          <TextField icon={<Tag size={15} />} name="name" label="Name" />
        </div>

        <Select
          items={Object.entries(Degree).map(([k, v]) => ({ id: k, name: v }))}
          placeholder="Pick a degree"
          label="Degree"
          name="degree"
        >
          {(item) => <SelectItem>{item.name}</SelectItem>}
        </Select>

        <Divider />

        <footer className={styles.programFormFooter}>
          <Button size="sm" variant="transparent" type="reset" onPress={closeForm}>
            <X size={15} /> Cancel
          </Button>

          <div className={styles.programFormSubmit}>
            <Switch isSelected={selectOnCreate} onChange={setSelectOnCreate}>
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
    </div>
  );
}

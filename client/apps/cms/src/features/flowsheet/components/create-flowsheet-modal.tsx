import { Form } from '@/shared/components/ui/Form.tsx';
import { NumberField } from '@/shared/components/ui/NumberField.tsx';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries.ts';
import React from 'react';
import { createPortal } from 'react-dom';
import { DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Modal } from '@/shared/components/ui/Modal.tsx';
import { Button } from '@/shared/components/ui/Button';
import {
  CalendarDays,
  ChevronLeft,
  GraduationCap,
  Grid2X2,
  Hash,
  Layers2,
  Plus,
  Tag,
  X,
} from 'lucide-react';
import styles from './create-flowsheet-modal.module.css';
import { ComboBox } from '@/shared/components/ui/ComboBox.tsx';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/breadcrumbs.tsx';
import { TextField } from '@/shared/components/ui/TextField.tsx';
import { Divider } from '@/shared/components/ui/divider.tsx';
import { Degree, Program } from '@/features/program/domain/program.ts';
import { Switch } from '@/shared/components/ui/Switch.tsx';
import { ListBox, ListBoxItem, ListEmptyState } from '@/shared/components/ui/ListBox.tsx';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import { programApi } from '@/features/program/api.ts';
import { Select, SelectItem } from '@/shared/components/ui/Select.tsx';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { Key } from 'react-aria-components';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import { useNavigate } from '@tanstack/react-router';

export function CreateFlowsheetModal() {
  const [programFormIsOpen, setProgramFormIsOpen] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [openFlowsheet, setOpenFlowsheet] = React.useState<boolean>(true);

  const createFlowsheet = useMutation({
    mutationFn: flowsheetApi.createFlowsheet,
    meta: { successMessage: 'Flowsheet created.' },
  });

  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (programFormIsOpen) {
      return;
    }
    
    let formData = Object.fromEntries(new FormData(e.currentTarget));

    createFlowsheet.mutate(formData, {
      onSuccess: (data) => {
        setIsOpen(false);
        if (openFlowsheet) {
          navigate({ to: '/flowsheets/$flowsheetId', params: { flowsheetId: String(data.id) } });
        }
      },
    });
  };

  return (
    <DialogTrigger>
      <TooltipTrigger>
        <Button onPress={() => setIsOpen(true)} size="sm" variant="transparent">
          <Plus size={15} />
        </Button>

        <Tooltip>New</Tooltip>
      </TooltipTrigger>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="xl">
        <Form onSubmit={onSubmit}>
          <div className={styles.content}>
            <header className={styles.header}>
              <Breadcrumbs>
                <Breadcrumb base>
                  <Layers2 size={15} /> Flowsheets
                </Breadcrumb>

                <Breadcrumb>
                  <Grid2X2 size={15} color="teal" /> New flowsheet
                </Breadcrumb>
              </Breadcrumbs>

              <Button variant="transparent" size="icon" onPress={() => setIsOpen(false)}>
                <X size={14} />
              </Button>
            </header>

            <section className={styles.form}>
              <section className={styles.programAndName}>
                <ProgramComboBox
                  programFormIsOpen={programFormIsOpen}
                  setProgramFormIsOpen={setProgramFormIsOpen}
                />

                <TextField
                  name="name"
                  aria-label="Flowsheet name"
                  icon={<Tag size={14} />}
                  variant="transparent"
                  placeholder="Enter an optional name (e.g., General, Data Science, Cybersecurity)"
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
                  defaultValue={new Date().getFullYear()}
                />
              </div>
            </section>
          </div>

          <Divider />

          <section className={styles.footer}>
            <Switch isSelected={openFlowsheet} onChange={setOpenFlowsheet}>
              Open after creating
            </Switch>

            <Button isPending={createFlowsheet.isPending} variant="primary" type="submit">
              <Grid2X2 size={15} /> Create flowsheet
            </Button>
          </section>
        </Form>
      </Modal>
    </DialogTrigger>
  );
}

type ProgramComboBoxProps = {
  programFormIsOpen: boolean;
  setProgramFormIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function ProgramComboBox({ programFormIsOpen, setProgramFormIsOpen }: ProgramComboBoxProps) {
  const [comboBoxState, setComboBoxState] = React.useState<{
    selectedKey: Key | null;
    inputValue: string;
  }>({
    selectedKey: null,
    inputValue: '',
  });
  const programFormRef = React.useRef<HTMLDivElement>(null);
  const { data: programs } = useSuspenseQuery(programQueries.collection);

  const onSelectionChange = (id: Key | null) => {
    const program = programs.map[id ?? ''];
    if (!program) return;

    setComboBoxState({
      inputValue: getProgramDisplayName(program),
      selectedKey: id,
    });
  };

  const onInputChange = (value: string) => {
    setComboBoxState((prevState) => ({
      inputValue: value,
      selectedKey: value === '' ? null : prevState.selectedKey,
    }));
  };

  const onCreateProgram = (program: Program) => {
    setComboBoxState({
      inputValue: getProgramDisplayName(program),
      selectedKey: program.id,
    });
  };

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
        onInputChange={onInputChange}
        selectedKey={comboBoxState.selectedKey}
        onSelectionChange={onSelectionChange}
        onOpenChange={(isOpen) => {
          if (isOpen && programFormIsOpen) {
            setProgramFormIsOpen(false);
          }
        }}
      >
        {!programFormIsOpen && (
          <ListBox
            renderEmptyState={() => (
              <ListEmptyState>No programs found. Create a new one below.</ListEmptyState>
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
        )}

        <div ref={programFormRef} />

        {!programFormIsOpen && (
          <section className={styles.createProgramSection}>
            <TooltipTrigger>
              <Button
                aria-label="Create program"
                onPress={() => setProgramFormIsOpen(true)}
                className={styles.createProgramButton}
              >
                <Plus size={15} />
              </Button>

              <Tooltip>Create program</Tooltip>
            </TooltipTrigger>
          </section>
        )}
      </ComboBox>

      {programFormIsOpen &&
        programFormRef.current &&
        createPortal(
          <CreateProgramForm
            closeForm={() => setProgramFormIsOpen(false)}
            onCreateProgram={onCreateProgram}
          />,
          programFormRef.current
        )}
    </>
  );
}

function CreateProgramForm({
  closeForm,
  onCreateProgram,
}: {
  closeForm: () => void;
  onCreateProgram: (program: Program) => void;
}) {
  const [selectOnCreate, setSelectOnCreate] = React.useState<boolean>(true);

  const createProgram = useMutation({
    mutationFn: programApi.createProgram,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    createProgram.mutate(formData, {
      onSuccess: (data) => {
        if (selectOnCreate) {
          onCreateProgram(data);
        }
        closeForm();
      },
    });
  };

  return (
    <Form id="program-form" onSubmit={handleSubmit}>
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
        <Button size="sm" variant="transparent" type="reset" onPress={closeForm}>
          <ChevronLeft size={14} /> Cancel
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
  );
}

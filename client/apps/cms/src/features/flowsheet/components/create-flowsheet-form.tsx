import { Form } from '@/shared/components/ui/Form.tsx';
import { NumberField } from '@/shared/components/ui/NumberField.tsx';
import { SelectItem } from '@/shared/components/ui/Select.tsx';
import { useSuspenseQuery } from '@tanstack/react-query';
import { programQueries } from '@/features/program/queries.ts';
import { getProgramDisplayName } from '@/features/program/domain/getProgramDisplayName.ts';
import React from 'react';
import { Dialog, DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Modal } from '@/shared/components/ui/Modal.tsx';
import { Button } from '@/shared/components/ui/Button';
import { CalendarDays, Grid2X2, Layers2, Plus, Tag, X } from 'lucide-react';
import styles from './create-flowsheet-form.module.css';
import { ComboBox } from '@/shared/components/ui/ComboBox.tsx';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/breadcrumbs.tsx';
import { TextField } from '@/shared/components/ui/TextField.tsx';
import { Divider } from '@/shared/components/ui/divider.tsx';

export function CreateFlowsheetForm() {
  const { data: programs } = useSuspenseQuery(programQueries.collection);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <DialogTrigger>
      <Button size="sm" variant="primary">
        <Plus size={15} /> New
      </Button>

      <Modal size="lg">
        <Dialog>
          <div className={styles.dialog}>
            <header className={styles.header}>
              <Breadcrumbs>
                <Breadcrumb base>
                  <Layers2 size={15} /> Flowsheets
                </Breadcrumb>

                <Breadcrumb>
                  <Grid2X2 size={15} color="blue" /> New flowsheet
                </Breadcrumb>
              </Breadcrumbs>

              <Button variant="transparent" size="icon" slot="close">
                <X size={14} />
              </Button>
            </header>

            <Form onSubmit={onSubmit}>
              <section className={styles.mainForm}>
                <ComboBox
                  size="xl"
                  variant="transparent"
                  className={styles.programComboBox}
                  items={programs.list}
                  isRequired
                  placeholder="Pick a program"
                >
                  {(item) => {
                    const name = getProgramDisplayName(item);
                    return <SelectItem textValue={name}>{name}</SelectItem>;
                  }}
                </ComboBox>

                <TextField
                  icon={<Tag size={15} />}
                  variant="transparent"
                  placeholder="Add an optional name (General, Data Science, Cybersecurity, etc.)..."
                />
              </section>

              <NumberField
                isRequired
                formatOptions={{
                  useGrouping: false,
                }}
                icon={<CalendarDays size={16} />}
                defaultValue={new Date().getFullYear()}
              />
            </Form>

            <Divider />

            <section className={styles.footer}>
              <Button variant="primary">
                <Grid2X2 size={18} /> Create flowsheet
              </Button>
            </section>
          </div>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}

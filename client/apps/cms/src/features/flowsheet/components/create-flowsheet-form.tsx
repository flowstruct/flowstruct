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
import { Plus } from 'lucide-react';
import styles from './create-flowsheet-form.module.css';
import { ComboBox } from '@/shared/components/ui/ComboBox.tsx';

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
      <Modal>
        <Dialog>
          <Form onSubmit={onSubmit}>
            <ComboBox
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
            <NumberField label="Year" isRequired />
          </Form>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}

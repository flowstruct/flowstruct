import { Form } from '@/shared/components/ui/Form.tsx';
import { NumberField } from '@/shared/components/ui/NumberField.tsx';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { DialogTrigger } from '@/shared/components/ui/Dialog.tsx';
import { Modal } from '@/shared/components/ui/Modal.tsx';
import { Button } from '@/shared/components/ui/Button';
import { CalendarDays, Grid2X2, Layers2, Plus, Tag, X } from 'lucide-react';
import styles from './create-flowsheet-modal.module.css';
import { Breadcrumb, Breadcrumbs } from '@/shared/components/ui/breadcrumbs.tsx';
import { TextField } from '@/shared/components/ui/TextField.tsx';
import { Divider } from '@/shared/components/ui/divider.tsx';
import { Switch } from '@/shared/components/ui/Switch.tsx';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import { useNavigate } from '@tanstack/react-router';
import { handleSubmit } from '@/shared/utils/handle-submit.ts';
import { useDisclosure } from '@/shared/hooks/use-disclosure.ts';
import { ProgramComboBox } from '@/features/flowsheet/components/create-flowsheet-modal/program-combobox.tsx';

export function CreateFlowsheetModal() {
  const flowsheetModalState = useDisclosure();
  const programFormState = useDisclosure();
  const [navigateToFlowsheet, setNavigateToFlowsheet] = React.useState<boolean>(true);

  const createFlowsheet = useMutation({
    mutationFn: flowsheetApi.createFlowsheet,
    meta: { successMessage: 'Flowsheet created.' },
  });

  const navigate = useNavigate();

  const onSubmit = handleSubmit((formData) => {
    if (programFormState.isOpen) {
      return;
    }

    createFlowsheet.mutate(formData, {
      onSuccess: (data) => {
        flowsheetModalState.close();

        if (navigateToFlowsheet) {
          navigate({ to: '/flowsheets/$flowsheetId', params: { flowsheetId: String(data.id) } });
        }
      },
    });
  });

  return (
    <DialogTrigger>
      <TooltipTrigger>
        <Button onPress={flowsheetModalState.open} size="sm" variant="transparent">
          <Plus size={15} />
        </Button>

        <Tooltip>New</Tooltip>
      </TooltipTrigger>

      <Modal
        isOpen={flowsheetModalState.isOpen}
        onOpenChange={flowsheetModalState.setIsOpen}
        size="xl"
      >
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

              <Button variant="transparent" size="icon" onPress={flowsheetModalState.close}>
                <X size={14} />
              </Button>
            </header>

            <section className={styles.form}>
              <section className={styles.programAndName}>
                <ProgramComboBox programFormState={programFormState} />

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
            <Switch isSelected={navigateToFlowsheet} onChange={setNavigateToFlowsheet}>
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

import { type Course } from '../../domain/course.ts';
import styles from './course-placement-form.module.css';
import { Stack } from '../layout/stack.tsx';
import Group from '../layout/group.tsx';
import { Input, NumberField as AriaNumberField, TextArea } from 'react-aria-components';
import { Button } from '../ui/Button.tsx';
import { ArrowLeftToLine, Clock, Globe2, Plus, Settings2 } from 'lucide-react';
import { DialogTrigger } from '../ui/Dialog.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import { Popover } from '../ui/Popover.tsx';
import { Box } from '../layout/box.tsx';
import { NumberField } from '../ui/NumberField.tsx';
import { Select, SelectItem } from '../ui/Select.tsx';
import { UnstyledButton } from '../ui/UnstyledButton.tsx';
import { Form } from '../ui/Form.tsx';
import type { FormReturnResult } from '../../hooks/form.hook.ts';
import React from 'react';

type CoursePlacementFormProps = {
  form: FormReturnResult<Course>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose?: () => void;
};

export function CoursePlacementForm({ form, onSubmit, onClose }: CoursePlacementFormProps) {
  return (
    <Form onSubmit={onSubmit}>
      <Stack gap={1} fill justify="between" className={styles.form}>
        <Stack>
          <Group justify="between">
            <Input
              required
              type="text"
              aria-label="Course code"
              name="code"
              placeholder="Course code"
              className={styles.courseCode}
              autoComplete="off"
              autoFocus
              value={form.data.code}
              onChange={(e) => form.updateData('code', e.target.value)}
            />

            <Button size="none" variant="ghost" onPress={onClose} shape="icon" excludeFromTabOrder>
              <ArrowLeftToLine size={15} />
            </Button>
          </Group>

          <TextArea
            tabIndex={0}
            className={styles.courseName}
            required
            aria-label="Add name"
            placeholder="Add name..."
            autoComplete="off"
            name="name"
            value={form.data.name}
            onChange={(e) => form.updateData('name', e.target.value)}
          />
        </Stack>

        <Group justify="between">
          <AriaNumberField
            name="creditHours"
            aria-label="Credit hours"
            value={form.data.creditHours}
            onChange={(value) => form.updateData('creditHours', value)}
            minValue={0}
            maxValue={99}
            isRequired
          >
            <Group gap={1} className={styles.creditHours}>
              Cr.
              <Input className={styles.creditHoursInput} />
            </Group>
          </AriaNumberField>

          <DialogTrigger>
            <TooltipTrigger>
              <Button size="xs" shape="icon" variant="ghost">
                <Settings2 size={15} />
              </Button>

              <Tooltip>Details</Tooltip>
            </TooltipTrigger>

            <Popover>
              <Box px={5} py={5} pt={4}>
                <Stack gap={4}>
                  <NumberField
                    icon={<Clock size={14} />}
                    maxValue={99}
                    minValue={0}
                    name="lectureHours"
                    label="Lecture hours (hrs/week)"
                    aria-label="Lecture hours (hours per week)"
                    value={form.data.lectureHours}
                    onChange={(value) => form.updateData('lectureHours', value)}
                  />

                  <NumberField
                    icon={<Clock size={14} />}
                    maxValue={99}
                    minValue={0}
                    name="practicalHours"
                    label="Practical hours (hrs/week)"
                    aria-label="Practical hours (hours per week)"
                    value={form.data.practicalHours}
                    onChange={(value) => form.updateData('practicalHours', value)}
                  />

                  <NumberField
                    icon={<Globe2 size={14} />}
                    maxValue={99}
                    minValue={0}
                    name="ects"
                    label="ECTS"
                    aria-label="ECTS"
                    value={form.data.ects}
                    onChange={(value) => form.updateData('ects', value)}
                  />

                  <Select
                    name="type"
                    size="sm"
                    aria-label="Teaching method"
                    label="Teaching method"
                    value={form.data.type}
                    onChange={(key) => form.updateData('type', key as Course['type'])}
                    items={[
                      { id: 'F2F', name: 'Face-to-face' },
                      { id: 'BLD', name: 'Blended' },
                      { id: 'OL', name: 'Online' },
                    ]}
                  >
                    {(item) => <SelectItem textValue={item.name}>{item.name}</SelectItem>}
                  </Select>
                </Stack>
              </Box>
            </Popover>
          </DialogTrigger>
        </Group>
      </Stack>

      <UnstyledButton type="submit" className={styles.submitButton}>
        <Plus size={15} /> Save
      </UnstyledButton>
    </Form>
  );
}

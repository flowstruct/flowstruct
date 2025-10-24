import { ArrowLeftToLine, Info, Plus } from 'lucide-react';
import { useState } from 'react';
import { useDisclosure } from '../../hooks/disclosure.hook.ts';
import { Form } from '../ui/Form.tsx';
import Group from '../layout/group.tsx';
import { Stack } from '../layout/stack.tsx';
import styles from './add-course-card.module.css';
import { UnstyledButton } from '../ui/UnstyledButton.tsx';
import { Input, NumberField as AriaNumberField, TextArea } from 'react-aria-components';
import { handleSubmit } from '../../utils/handle-submit.ts';
import type { Course } from '../../domain/course.ts';
import { addCourse } from '../../domain/course.ts';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { useKeyboard } from 'react-aria';
import { Button } from '../ui/Button.tsx';
import { Box } from '../layout/box.tsx';
import { Dialog, DialogTrigger } from '../ui/Dialog.tsx';
import { Popover } from '../ui/Popover.tsx';
import { NumberField } from '../ui/NumberField.tsx';
import { Select, SelectItem } from '../ui/Select.tsx';

type AddCourseCardProps = {
  termIndex: number;
};

const initialFormData: Omit<Course, 'id' | 'prerequisites' | 'corequisites'> = {
  code: '',
  name: '',
  creditHours: 3,
  ects: 0,
  lectureHours: 0,
  practicalHours: 0,
  type: 'F2F',
};

export function AddCourseCard({ termIndex }: AddCourseCardProps) {
  const { setFlowsheet } = useFlowsheet();
  const form = useDisclosure();
  const [formData, setFormData] = useState(initialFormData);

  const onSubmit = handleSubmit<Course>(() => {
    const course: Course = {
      id: crypto.randomUUID(),
      ...formData,
      prerequisites: [],
      corequisites: [],
    };

    setFlowsheet((flowsheet) => addCourse({ flowsheet, course, termIndex }));

    setFormData(initialFormData);

    form.close();
  });

  const updateFormData = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const formElement = e.currentTarget.closest('form');
        if (formElement) formElement.requestSubmit();
      }
      if (e.key === 'Escape') {
        form.close();
      }
    },
  });

  return (
    <>
      {!form.isOpen && (
        <UnstyledButton autoFocus className={styles.addCourseButton} onPress={form.open}>
          <Plus size={12} /> Add course
        </UnstyledButton>
      )}

      {form.isOpen && (
        <Form onSubmit={onSubmit}>
          <div className={`${styles.form}`} {...keyboardProps}>
            <Stack gap={1} fill justify="between">
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
                    value={formData.code}
                    onChange={(e) => updateFormData('code', e.target.value)}
                  />

                  <Button
                    size="none"
                    variant="ghost"
                    onPress={form.close}
                    shape="icon"
                    excludeFromTabOrder
                  >
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
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                />
              </Stack>

              <Group justify="between">
                <AriaNumberField
                  name="creditHours"
                  aria-label="Credit hours"
                  value={formData.creditHours}
                  onChange={(value) => updateFormData('creditHours', value)}
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
                  <Button size="xs" shape="icon" variant="ghost">
                    <Info size={15} />
                  </Button>

                  <Popover>
                    <Dialog>
                      <Stack gap={4}>
                        <NumberField
                          maxValue={99}
                          minValue={0}
                          name="lectureHours"
                          label="Lecture hours (hrs/week)"
                          aria-label="Lecture hours (hours per week)"
                          value={formData.lectureHours}
                          onChange={(value) => updateFormData('lectureHours', value)}
                        />

                        <NumberField
                          maxValue={99}
                          minValue={0}
                          name="practicalHours"
                          label="Practical hours (hrs/week)"
                          aria-label="Practical hours (hours per week)"
                          value={formData.practicalHours}
                          onChange={(value) => updateFormData('practicalHours', value)}
                        />

                        <NumberField
                          maxValue={99}
                          minValue={0}
                          name="ects"
                          label="ECTS"
                          aria-label="ECTS"
                          value={formData.ects}
                          onChange={(value) => updateFormData('ects', value)}
                        />

                        <Select
                          name="type"
                          size="sm"
                          aria-label="Teaching method"
                          label="Teaching method"
                          value={formData.type}
                          onChange={(key) => updateFormData('type', key as Course['type'])}
                          items={[
                            { id: 'F2F', name: 'Face-to-face' },
                            { id: 'BLD', name: 'Blended' },
                            { id: 'OL', name: 'Online' },
                          ]}
                        >
                          {(item) => <SelectItem textValue={item.name}>{item.name}</SelectItem>}
                        </Select>
                      </Stack>
                    </Dialog>
                  </Popover>
                </DialogTrigger>
              </Group>
            </Stack>
          </div>

          <Box py={2}>
            <Group justify="center">
              <UnstyledButton type="submit" className={styles.submitButton}>
                <Plus size={15} /> Save
              </UnstyledButton>
            </Group>
          </Box>
        </Form>
      )}
    </>
  );
}

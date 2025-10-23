import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { useDisclosure } from '../../hooks/disclosure.hook.ts';
import { Form } from '../ui/Form.tsx';
import Group from '../layout/group.tsx';
import { Stack } from '../layout/stack.tsx';
import styles from './add-course-card.module.css';
import { UnstyledButton } from '../ui/UnstyledButton.tsx';
import { TextArea } from 'react-aria-components';
import { handleSubmit } from '../../utils/handle-submit.ts';
import type { Course } from '../../domain/course.ts';
import { addCourse } from '../../domain/course.ts';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { useKeyboard } from 'react-aria';

type AddCourseCardProps = {
  termIndex: number;
};

export function AddCourseCard({ termIndex }: AddCourseCardProps) {
  const { setFlowsheet } = useFlowsheet();
  const form = useDisclosure();

  const onSubmit = handleSubmit<Course>((data) => {
    const course: Course = {
      id: crypto.randomUUID(),
      code: data.code ?? '',
      name: data.name ?? '',
      creditHours: data.creditHours ?? 0,
      ects: 0,
      lectureHours: 0,
      practicalHours: 0,
      type: 'F2F',
      prerequisites: [],
      corequisites: [],
    };

    setFlowsheet((flowsheet) => addCourse({ flowsheet, course, termIndex }));
    form.close();
  });

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
      {form.isOpen ? (
        <Form onSubmit={onSubmit}>
          <div className={`${styles.form}`} {...keyboardProps}>
            <Stack gap={1}>
              <input
                type="text"
                name="code"
                placeholder="Code"
                className={styles.courseCode}
                autoComplete="off"
                autoFocus
              />

              <TextArea
                className={styles.courseName}
                required
                placeholder="Name"
                autoComplete="off"
                name="name"
              />

              <Group justify="between">
                <Button type="reset" onPress={form.close} variant="transparent" shape="icon" size="sm">
                  <ChevronLeft size={14} />
                </Button>

                <Button type="submit" variant="transparent" size="sm" shape="icon">
                  <Plus size={14} />
                </Button>
              </Group>
            </Stack>
          </div>
        </Form>
      ) : (
        <UnstyledButton autoFocus className={styles.addCourseButton} onPress={form.open}>
          <Plus size={12} /> Add course
        </UnstyledButton>
      )}
    </>
  );
}

import { Book, Plus } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { useDisclosure } from '../../hooks/disclosure.hook.ts';
import { Form } from '../ui/Form.tsx';
import Group from '../layout/group.tsx';
import { Stack } from '../layout/stack.tsx';
import styles from './add-course-card.module.css';
import { UnstyledButton } from '../ui/UnstyledButton.tsx';
import { TextArea } from 'react-aria-components';
import { handleSubmit } from '../../utils/handle-submit.ts';
import type { Course } from '../../types/flowsheet.types.ts';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';

type AddCourseCardProps = {
  term: number;
};

export function AddCourseCard({ term }: AddCourseCardProps) {
  const { flowsheet, saveFlowsheet } = useFlowsheet();
  const form = useDisclosure();

  const onSubmit = handleSubmit<Course>((data) => {
    const newCourse: Course = {
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

    const newTerms = [...flowsheet.terms];

    if (!newTerms.find((t) => t.index === term)) {
      newTerms.push({ index: term, placements: [] });
    }

    const updatedTerms = newTerms.map((t) => {
      if (t.index !== term) return t;
      return {
        ...t,
        placements: [...t.placements, { type: 'COURSE' as const, course: newCourse.id, span: 1 }],
      };
    });

    saveFlowsheet({
      ...flowsheet,
      courses: { ...flowsheet.courses, [newCourse.id]: newCourse },
      terms: updatedTerms,
    });

    form.close();
  });

  return (
    <>
      {form.isOpen ? (
        <Form onSubmit={onSubmit}>
          <div className={styles.form}>
            <Stack gap={1}>
              <TextArea
                className={styles.courseName}
                icon={<Book size={14} />}
                placeholder="Enter course name"
                name="name"
                autoFocus
              />

              <Group justify="end">
                <Button type="reset" onPress={form.close} variant="ghost">
                  Close
                </Button>

                <Button type="submit" variant="primary" size="sm">
                  <Plus size={14} /> Add
                </Button>
              </Group>
            </Stack>
          </div>
        </Form>
      ) : (
        <UnstyledButton className={styles.addCourseButton} onPress={form.open}>
          <Plus size={12} /> Add course
        </UnstyledButton>
      )}
    </>
  );
}

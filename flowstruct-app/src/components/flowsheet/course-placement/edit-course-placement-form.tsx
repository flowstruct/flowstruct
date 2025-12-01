import {
  BookOpen,
  ChevronRight,
  Clock,
  Globe2,
  GraduationCap,
  Hash,
  Pencil,
  X,
} from 'lucide-react';
import { Button, Disclosure, DisclosurePanel, Heading } from 'react-aria-components';
import type { Course } from '../../../domain/course';
import type { DisclosureReturnResult } from '../../../hooks/disclosure.hook';
import { useDisclosure } from '../../../hooks/disclosure.hook.ts';
import { handleSubmit } from '../../../utils/handle-submit';
import { Box } from '../../layout/box.tsx';
import { Group } from '../../layout/group.tsx';
import { Stack } from '../../layout/stack';
import { Form } from '../../ui/Form.tsx';
import { NumberField } from '../../ui/NumberField.tsx';
import { Select, SelectItem } from '../../ui/Select.tsx';
import { TextField } from '../../ui/TextField';
import { Divider } from '../../ui/divider.tsx';
import styles from './edit-course-placement.module.css';
import { useCourses } from '../../../hooks/courses.hook.tsx';

type EditCourseFormProps = {
  course: Course;
  disclosure: DisclosureReturnResult;
};

// TODO: fix course edit bug not providing id
export function EditCourseForm({ course, disclosure }: EditCourseFormProps) {
  const { setCourses } = useCourses();

  const onSubmit = handleSubmit<Course>((data) => {
    const updatedCourse: Course = {
      ...data,
      id: course.id,
      code: data.code.toUpperCase(),
    };

    setCourses((courses) => {
      const updated = { ...courses };
      updated[course.id] = updatedCourse;
      return updated;
    });

    disclosure.close();
  });

  return (
    <Form onSubmit={onSubmit}>
      <Stack gap={4}>
        <Group slot="title" justify="between">
          <div className={styles.header}>
            <BookOpen size={14} />
            Edit course info
          </div>

          <Button slot="close">
            <X size={15} />
          </Button>
        </Group>

        <Stack>
          <TextField
            autoFocus
            width={500}
            name="name"
            defaultValue={course.name}
            variant="transparent"
            placeholder="Course name"
            className={styles.name}
          />

          <TextField
            icon={<Hash size={14} color="gray" />}
            name="code"
            defaultValue={course.code}
            variant="transparent"
            placeholder="Code"
            className={styles.code}
          />
        </Stack>

        <MoreDetails course={course} />

        <Divider />

        <Group justify="end">
          <Button type="submit" className={styles.saveChangesButton}>
            <Pencil size={15} /> Save changes
          </Button>
        </Group>
      </Stack>
    </Form>
  );
}

type MoreDetailsProps = {
  course: Course;
};

function MoreDetails({ course }: MoreDetailsProps) {
  const disclosure = useDisclosure();

  return (
    <Disclosure isExpanded={disclosure.isOpen} onExpandedChange={disclosure.setIsOpen}>
      <Heading>
        <Button slot="trigger" className={styles.moreDetails}>
          <ChevronRight
            style={{ rotate: disclosure.isOpen ? '90deg' : '', transition: '250ms ease-in-out' }}
            size={18}
          />
          More details
        </Button>
      </Heading>

      <DisclosurePanel>
        <Box pt={2}>
          <Stack>
            <Group>
              <NumberField
                autoFocus
                icon={<GraduationCap size={15} />}
                maxValue={99}
                minValue={0}
                name="creditHours"
                label="Credit hours (Cr.)"
                aria-label="Credit hours"
                defaultValue={course.creditHours}
              />

              <NumberField
                icon={<Globe2 size={15} />}
                maxValue={99}
                minValue={0}
                name="ects"
                label="ECTS"
                aria-label="ECTS"
                defaultValue={course.ects}
              />
            </Group>

            <Group>
              <NumberField
                icon={<Clock size={15} />}
                maxValue={99}
                minValue={0}
                name="lectureHours"
                label="Lecture hours (Hrs/week)"
                aria-label="Lecture hours (hours per week)"
                defaultValue={course.lectureHours}
              />

              <NumberField
                icon={<Clock size={15} />}
                maxValue={99}
                minValue={0}
                name="practicalHours"
                label="Practical hours (Hrs/week)"
                aria-label="Practical hours (hours per week)"
                defaultValue={course.practicalHours}
              />
            </Group>

            <Select
              name="type"
              size="sm"
              aria-label="Teaching method"
              label="Teaching method"
              defaultValue={course.type}
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
      </DisclosurePanel>
    </Disclosure>
  );
}

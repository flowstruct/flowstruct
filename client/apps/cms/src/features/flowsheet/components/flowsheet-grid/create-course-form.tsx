import { DisclosureState } from '@/shared/types';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { courseApi } from '@/features/course/api';
import { handleSubmit } from '@/shared/utils/handle-submit';
import { Form } from '@/shared/components/ui/Form';
import styles from './create-course-form.module.css';
import { TextField } from '@/shared/components/ui/TextField';
import { NumberField } from '@/shared/components/ui/NumberField';
import { Select, SelectItem } from '@/shared/components/ui/Select';
import { Switch } from '@/shared/components/ui/Switch';
import { Divider } from '@/shared/components/ui/divider';
import { Button } from '@/shared/components/ui/Button';
import { BookOpen, ChevronLeft, Hash, Tag } from 'lucide-react';
import { CourseType } from '@/features/course/domain/course';
import { Course } from '@/features/course/domain/course';
import { Group } from '@/shared/components/layout/group';

export function CreateCourseForm({
  courseFormState,
  onCourseCreated,
}: {
  courseFormState: DisclosureState;
  onCourseCreated?: (course: Course) => void;
}) {
  const [selectCourse, setSelectCourse] = React.useState<boolean>(true);

  const createCourse = useMutation({
    mutationFn: courseApi.createCourse,
  });

  const onSubmit = handleSubmit((formData) => {
    createCourse.mutate(formData, {
      onSuccess: (data) => {
        if (selectCourse && onCourseCreated) {
          onCourseCreated(data);
        }

        courseFormState.close();
      },
    });
  });

  return (
    <Form id="course-form" onSubmit={onSubmit}>
      <div className={styles.courseFormFields}>
        <TextField
          autoFocus
          placeholder="A unique identifier (CS101, MATH201, etc.)..."
          isRequired
          icon={<Hash size={15} />}
          name="code"
          label="Code"
        />

        <TextField isRequired icon={<Tag size={15} />} name="name" label="Name" />

        <Group>
          <NumberField
            minValue={0}
            defaultValue={0}
            name="creditHours"
            label="Credit Hours"
            isRequired
          />

          <NumberField minValue={0} defaultValue={0} name="ects" label="ECTS" isRequired />
        </Group>

        <Group>
          <NumberField minValue={0} defaultValue={0} name="lectureHours" label="Lecture Hours" />

          <NumberField
            minValue={0}
            defaultValue={0}
            name="practicalHours"
            label="Practical Hours"
          />
        </Group>

        <Select
          items={Object.entries(CourseType).map(([k, v]) => ({ id: k, name: v }))}
          placeholder="Pick a type"
          label="Type"
          name="type"
          isRequired
        >
          {(item) => <SelectItem>{item.name}</SelectItem>}
        </Select>
      </div>

      <Divider />

      <footer className={styles.courseFormFooter}>
        <Button size="sm" variant="transparent" type="reset" onPress={courseFormState.close}>
          <ChevronLeft size={14} /> Cancel
        </Button>

        <div className={styles.courseFormSubmit}>
          <Switch isSelected={selectCourse} onChange={setSelectCourse}>
            Select after creating
          </Switch>

          <Button
            size="sm"
            variant="primary"
            type="submit"
            form="course-form"
            isPending={createCourse.isPending}
          >
            <BookOpen size={15} /> Create course
          </Button>
        </div>
      </footer>
    </Form>
  );
}

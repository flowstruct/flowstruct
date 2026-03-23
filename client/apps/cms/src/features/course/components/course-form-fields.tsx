import { CourseType } from '@/features/course/domain/course';
import { TextField } from '@/shared/components/ui/TextField';
import { NumberField } from '@/shared/components/ui/NumberField';
import { Select, SelectItem } from '@/shared/components/ui/Select';
import { Clock, Globe, GraduationCap, Hash, Tag } from 'lucide-react';
import { Group } from '@/shared/components/layout/group';
import styles from './course-form-fields.module.css';

type CourseFormFieldsProps = {
  defaultValues?: {
    code?: string;
    name?: string;
    creditHours?: number;
    ects?: number;
    lectureHours?: number;
    practicalHours?: number;
    type?: string;
  };
  isLoading?: boolean;
};

export function CourseFormFields({ defaultValues, isLoading }: CourseFormFieldsProps) {
  if (isLoading) {
    return <CourseFormFieldsSkeleton />;
  }

  return (
    <section className={styles.form}>
      <TextField
        autoFocus
        placeholder="A unique identifier (CS101, MATH201, etc.)..."
        isRequired
        icon={<Hash size={15} />}
        name="code"
        label="Code"
        defaultValue={defaultValues?.code}
      />

      <TextField
        isRequired
        icon={<Tag size={15} />}
        name="name"
        label="Name"
        defaultValue={defaultValues?.name}
      />

      <Group>
        <NumberField
          fullWidth
          minValue={0}
          defaultValue={defaultValues?.creditHours ?? 0}
          name="creditHours"
          label="Credit Hours"
          isRequired
          icon={<GraduationCap size={15} />}
        />

        <NumberField
          fullWidth
          minValue={0}
          defaultValue={defaultValues?.ects ?? 0}
          name="ects"
          label="ECTS"
          isRequired
          icon={<Globe size={15} />}
        />
      </Group>

      <Group>
        <NumberField
          fullWidth
          minValue={0}
          defaultValue={defaultValues?.lectureHours ?? 0}
          name="lectureHours"
          label="Lecture Hours"
          icon={<Clock size={15} />}
        />

        <NumberField
          fullWidth
          minValue={0}
          defaultValue={defaultValues?.practicalHours ?? 0}
          name="practicalHours"
          label="Practical Hours"
          icon={<Clock size={15} />}
        />
      </Group>

      <Select
        items={Object.entries(CourseType).map(([k, v]) => ({ id: k, name: v }))}
        placeholder="Pick a type"
        label="Type"
        name="type"
        defaultValue={defaultValues?.type ?? 'F2F'}
        isRequired
      >
        {(item) => <SelectItem>{item.name}</SelectItem>}
      </Select>
    </section>
  );
}

function CourseFormFieldsSkeleton() {
  return (
    <section className={styles.form}>
      <div className={styles.skeleton} />

      <div className={styles.skeleton} />

      <div className={styles.skeletonGroup}>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>

      <div className={styles.skeletonGroup}>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>

      <div className={styles.skeleton} />
    </section>
  );
}

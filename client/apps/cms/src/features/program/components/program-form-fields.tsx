import { Degree } from '@/features/program/domain/program';
import { TextField } from '@/shared/components/ui/TextField';
import { Select, SelectItem } from '@/shared/components/ui/Select';
import { Hash, Tag } from 'lucide-react';
import styles from './program-form-fields.module.css';

type ProgramFormFieldsProps = {
  defaultValues?: {
    code?: string;
    name?: string;
    degree?: string;
  };
};

export function ProgramFormFields({ defaultValues }: ProgramFormFieldsProps) {
  return (
    <section className={styles.form}>
      <TextField
        autoFocus
        placeholder="A unique identifier (MECH, CS, MGT, etc.)..."
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

      <Select
        isRequired
        items={Object.entries(Degree).map(([k, v]) => ({ id: k, name: v }))}
        placeholder="Pick a degree"
        label="Degree"
        name="degree"
        defaultValue={defaultValues?.degree}
      >
        {(item) => <SelectItem>{item.name}</SelectItem>}
      </Select>
    </section>
  );
}

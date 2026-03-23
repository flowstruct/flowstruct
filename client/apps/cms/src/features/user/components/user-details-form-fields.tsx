import styles from './user-details-form-fields.module.css';
import { Mail, User } from 'lucide-react';
import { TextField } from '@/shared/components/ui/TextField';

type UserDetailsFormFieldsProps = {
  defaultValues?: {
    username?: string;
    email?: string;
  };
};

export function UserDetailsFormFields({ defaultValues }: UserDetailsFormFieldsProps) {
  return (
    <section className={styles.fields}>
      <TextField
        autoFocus
        name="username"
        label="Username"
        placeholder="Enter username"
        defaultValue={defaultValues?.username}
        isRequired
        autoComplete="off"
        icon={<User size={14} />}
      />

      <TextField
        name="email"
        label="Email"
        type="email"
        placeholder="Enter email address"
        defaultValue={defaultValues?.email}
        isRequired
        autoComplete="off"
        icon={<Mail size={14} />}
      />
    </section>
  );
}
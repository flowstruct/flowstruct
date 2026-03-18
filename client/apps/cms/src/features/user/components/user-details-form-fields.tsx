import styles from './user-details-form-fields.module.css';
import { Info, Lock, Mail, User } from 'lucide-react';
import { TextField } from '@/shared/components/ui/TextField';

type UserDetailsFormFieldsProps = {
  defaultValues: {
    username: string;
    email: string;
  };
};

export function UserDetailsFormFields({ defaultValues }: UserDetailsFormFieldsProps) {
  return (
    <section className={styles.fields}>
      <TextField
        name="username"
        label="Username"
        placeholder="Enter username"
        defaultValue={defaultValues.username}
        isRequired
        icon={<User size={14} />}
      />

      <TextField
        name="email"
        label="Email"
        type="email"
        placeholder="Enter email address"
        defaultValue={defaultValues.email}
        isRequired
        icon={<Mail size={14} />}
      />

      <div className={styles.passwordInfo}>
        <div className={styles.passwordInfoHeader}>
          <Info size={13} />
          Password requirements
        </div>
        <ul className={styles.passwordInfoList}>
          <li>At least 8 characters long</li>
          <li>One uppercase letter</li>
          <li>One lowercase letter</li>
          <li>One digit</li>
          <li>One special character (@$!%*?&amp;)</li>
        </ul>
      </div>

      <TextField
        name="currentPassword"
        label="Current password"
        type="password"
        placeholder="Enter current password"
        icon={<Lock size={14} />}
      />

      <TextField
        name="newPassword"
        label="New password"
        type="password"
        placeholder="Enter new password"
        icon={<Lock size={14} />}
      />

      <TextField
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        placeholder="Confirm new password"
        icon={<Lock size={14} />}
      />
    </section>
  );
}

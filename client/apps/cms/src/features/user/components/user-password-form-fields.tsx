import styles from './user-password-form-fields.module.css';
import { Info, Lock } from 'lucide-react';
import { TextField } from '@/shared/components/ui/TextField';

type UserPasswordFormFieldsProps = {
  showCurrentPassword?: boolean;
};

export function UserPasswordFormFields({
  showCurrentPassword = false,
}: UserPasswordFormFieldsProps) {
  return (
    <section className={styles.fields}>
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

      {showCurrentPassword && (
        <TextField
          autoFocus
          name="currentPassword"
          label="Current password"
          type="password"
          placeholder="Enter current password"
          icon={<Lock size={14} />}
        />
      )}

      <TextField
        name="newPassword"
        label="New password"
        type="password"
        placeholder="Enter new password"
        autoComplete="new-password"
        icon={<Lock size={14} />}
      />

      <TextField
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        placeholder="Confirm new password"
        autoComplete="new-password"
        icon={<Lock size={14} />}
      />
    </section>
  );
}


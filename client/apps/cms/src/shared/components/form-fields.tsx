import { PropsWithChildren } from 'react';
import styles from './form-fields.module.css';

export function FormFields({ children }: PropsWithChildren) {
  return <div className={styles.formFields}>{children}</div>;
}

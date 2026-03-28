import { PropsWithChildren, ReactNode } from 'react';
import styles from './settings-section.module.css';

export function SettingsSection({ children }: PropsWithChildren) {
  return <div className={styles.settingsSectionWrapper}>{children}</div>;
}

export function SettingsSectionHeader({ children }: PropsWithChildren) {
  return <h2 className={styles.settingsSectionHeader}>{children}</h2>;
}

export function SettingsSectionBody({ children }: PropsWithChildren) {
  return <section className={styles.settingsSection}>{children}</section>;
}

export function SettingsSectionField({
  label,
  description,
  children,
}: PropsWithChildren<{ label: string; description?: ReactNode }>) {
  return (
    <div className={styles.settingsField}>
      <div className={styles.settingsFieldLabelContainer}>
        <p className={styles.settingsFieldLabel}>{label}</p>
        {description && <p className={styles.settingsFieldDescription}>{description}</p>}
      </div>
      {children}
    </div>
  );
}
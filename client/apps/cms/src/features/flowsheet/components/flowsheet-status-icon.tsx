import { Grid2x2 } from 'lucide-react';
import { FlowsheetSummary } from '@/features/flowsheet/domain/flowsheet';
import styles from './flowsheet-status-icon.module.css';

type FlowsheetStatusIconProps = {
  flowsheet: FlowsheetSummary;
};

export function FlowsheetStatusIcon({ flowsheet }: FlowsheetStatusIconProps) {
  return (
    <div data-status={flowsheet.status || undefined} className={styles.statusIcon}>
      <Grid2x2 size={15} />
    </div>
  );
}

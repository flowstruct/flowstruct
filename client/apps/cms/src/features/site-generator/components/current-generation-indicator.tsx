import { useCurrentGeneration } from '@/features/site-generator/hooks/use-current-generation';
import { Loader2, FolderClock } from 'lucide-react';
import styles from './current-generation-indicator.module.css';

export function CurrentGenerationIndicator() {
  const { current, isActive } = useCurrentGeneration();

  if (!isActive) return;

  const statusText = {
    PENDING: 'Pending',
    RUNNING: 'Running',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
  };

  return (
    <div className={styles.indicator}>
      {isActive ? <Loader2 size={14} className={styles.spinner} /> : <FolderClock size={14} />}
      <span className={styles.text}>
        Generation #{current.id} - {statusText[current.status]}
      </span>
    </div>
  );
}

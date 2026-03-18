import { useCurrentGeneration } from '@/features/site-generator/hooks/use-current-generation';
import { siteGeneratorApi } from '@/features/site-generator/api';
import { siteGeneratorKeys } from '@/features/site-generator/queries';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, FolderClock, CheckCircle } from 'lucide-react';
import styles from './current-generation-indicator.module.css';

export function CurrentGenerationIndicator() {
  const { currentGeneration, isActive } = useCurrentGeneration();
  const queryClient = useQueryClient();

  if (!currentGeneration) {
    return null;
  }

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
        Generation #{currentGeneration.id} - {statusText[currentGeneration.status]}
      </span>
    </div>
  );
}


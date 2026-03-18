import { FolderClock, Loader2, Folder, FolderX } from 'lucide-react';
import { SiteGenerationSummary } from '@/features/site-generator/domain/site-generator';
import styles from './site-generator-status-icon.module.css';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip';

type SiteGeneratorStatusIconProps = {
  generation: SiteGenerationSummary;
  errorMessage?: string | null;
};

export function SiteGeneratorStatusIcon({
  generation,
  errorMessage,
}: SiteGeneratorStatusIconProps) {
  const icon = (() => {
    switch (generation.status) {
      case 'PENDING':
        return <FolderClock size={15} className={styles.pending} />;
      case 'RUNNING':
        return <Loader2 size={15} className={styles.running} />;
      case 'COMPLETED':
        return <Folder size={15} className={styles.completed} />;
      case 'FAILED':
        return <FolderX size={15} className={styles.failed} />;
    }
  })();

  if (generation.status === 'FAILED' && errorMessage) {
    return (
      <TooltipTrigger>
        <div className={styles.statusIcon}>{icon}</div>
        <Tooltip>{errorMessage}</Tooltip>
      </TooltipTrigger>
    );
  }

  return <div className={styles.statusIcon}>{icon}</div>;
}

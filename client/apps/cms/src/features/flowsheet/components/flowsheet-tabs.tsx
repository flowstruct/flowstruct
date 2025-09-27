import { Button } from '@/shared/components/ui/Button.tsx';
import { CircleDashed, CircleDot, Layers2 } from 'lucide-react';
import styles from './flowsheet-tabs.module.css';

export function FlowsheetTabs() {
  return (
    <nav className={styles.tabs}>
      <Button variant="flat" size="sm">
        <Layers2 size={14} /> All flowsheets
      </Button>

      <Button variant="flat" size="sm">
        <CircleDot size={14} /> Active
      </Button>

      <Button variant="flat" size="sm">
        <CircleDashed size={14} /> Archived
      </Button>
    </nav>
  );
}

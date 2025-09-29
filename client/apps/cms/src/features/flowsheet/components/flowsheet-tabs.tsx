import { Button } from '@/shared/components/ui/Button.tsx';
import { CircleDashed, CircleDot, Layers2 } from 'lucide-react';
import styles from './flowsheet-tabs.module.css';
import { FlowsheetTabOptions } from '@/routes/_app/flowsheets';

type FlowsheetTabsProps = {
  currentTab: FlowsheetTabOptions;
  onTabChange: (tab: FlowsheetTabOptions) => void;
};

export function FlowsheetTabs({ currentTab, onTabChange }: FlowsheetTabsProps) {
  return (
    <nav className={styles.tabs}>
      <Button
        data-active={currentTab === 'all' || undefined}
        variant="flat"
        size="sm"
        className={styles.tab}
        onPress={() => onTabChange('all')}
      >
        <Layers2 size={14} /> All flowsheets
      </Button>

      <Button
        data-active={currentTab === 'active' || undefined}
        variant="flat"
        size="sm"
        className={styles.tab}
        onPress={() => onTabChange('active')}
      >
        <CircleDot size={14} /> Active
      </Button>

      <Button
        data-active={currentTab === 'archived' || undefined}
        variant="flat"
        size="sm"
        className={styles.tab}
        onPress={() => onTabChange('archived')}
      >
        <CircleDashed size={14} /> Archived
      </Button>
    </nav>
  );
}

import { Button } from '@/shared/components/ui/Button.tsx';
import styles from './tabs.module.css';
import { TabOption } from '@/shared/types';

type TabsProps<T extends string> = {
  tabs: TabOption<T>[];
  currentTab: T;
  onTabChange: (tab: T) => void;
};

export function Tabs<T extends string>({ tabs, currentTab, onTabChange }: TabsProps<T>) {
  return (
    <nav className={styles.tabs}>
      {tabs.map(({ value, label, icon }) => (
        <Button
          key={value}
          data-active={currentTab === value || undefined}
          variant="flat"
          size="xs"
          className={styles.tab}
          onPress={() => onTabChange(value)}
        >
          {icon}
          {label}
        </Button>
      ))}
    </nav>
  );
}

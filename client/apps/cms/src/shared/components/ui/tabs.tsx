import styles from './tabs.module.css';
import { TabOption } from '@/shared/types';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton';

type TabsProps<T extends string> = {
  tabs: TabOption<T>[];
  currentTab: T;
  onTabChange: (tab: T) => void;
};

export function Tabs<T extends string>({ tabs, currentTab, onTabChange }: TabsProps<T>) {
  return (
    <nav className={styles.tabs}>
      {tabs.map(({ value, label, icon }) => (
        <UnstyledButton
          key={value}
          data-active={currentTab === value || undefined}
          className={styles.tab}
          onPress={() => onTabChange(value)}
        >
          {icon}
          {label}
        </UnstyledButton>
      ))}
    </nav>
  );
}

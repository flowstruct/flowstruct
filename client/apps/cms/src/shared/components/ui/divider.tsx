import styles from './divider.module.css';

type DividerProps = {
  orientation?: 'vertical' | 'horizontal';
};

export function Divider({ orientation = 'horizontal' }: DividerProps) {
  return <div className={styles.divider} data-orientation={orientation} />;
}

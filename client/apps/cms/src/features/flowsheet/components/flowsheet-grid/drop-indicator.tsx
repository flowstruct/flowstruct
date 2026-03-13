import { useTermContext } from '@/features/flowsheet/contexts/term-context';
import styles from './drop-indicator.module.css';
import { usePlacementMoveContext } from '@/features/flowsheet/contexts/placement-move-context';

type DropIndicatorProps = {
  last?: boolean;
  position: number;
};

export function DropIndicator({ last = false, position }: DropIndicatorProps) {
  const { term } = useTermContext();
  const { allowedTerms } = usePlacementMoveContext();

  return (
    <div
      data-position={position}
      data-term-id={term.id}
      data-disabled={!allowedTerms.has(term.id)}
      className={styles.dropIndicator}
      style={last && term.placements.length > 0 ? { bottom: '-0.35rem' } : { top: '-0.35rem' }}
    />
  );
}

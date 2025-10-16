import styles from './drop-indicator.module.css';
import { useDrop } from 'react-aria';
import React from 'react';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';

type DropIndicatorProps = {
  term: number;
  position: number;
};

export function DropIndicator({ term, position }: DropIndicatorProps) {
  const { draggingCourse } = useFlowsheetGridContext();
  const ref = React.useRef(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,
  });

  return (
    <div
      data-is-dragging-course={draggingCourse !== null}
      {...dropProps}
      ref={ref}
      className={styles.dropZone}
    >
      <div data-is-drop-target={isDropTarget} className={styles.indicator} />
    </div>
  );
}

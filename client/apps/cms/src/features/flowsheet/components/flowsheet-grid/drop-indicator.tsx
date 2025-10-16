import styles from './drop-indicator.module.css';
import { useDrop } from 'react-aria';
import React from 'react';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { flowsheetKeys } from '@/features/flowsheet/queries.ts';
import { movePlacement } from '@/features/flowsheet/domain/movePlacement.ts';

type DropIndicatorProps = {
  term: number;
  position: number;
};

export function DropIndicator({ term, position }: DropIndicatorProps) {
  const { flowsheet } = useFlowsheetContext();
  const { draggingCourse } = useFlowsheetGridContext();

  const moveCourse = useMutation({
    mutationFn: () =>
      flowsheetApi.moveCourse({
        flowsheetId: flowsheet.id,
        courseId: draggingCourse,
        term,
        position,
      }),
    onMutate: (_, context) => {
      context.client.setQueryData(
        flowsheetKeys.detail(flowsheet.id),
        movePlacement(flowsheet, draggingCourse, term, position)
      );
    },
  });

  const ref = React.useRef(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,
    onDrop: () => {
      moveCourse.mutate();
    },
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

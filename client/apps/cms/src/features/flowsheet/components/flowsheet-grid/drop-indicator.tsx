import styles from './drop-indicator.module.css';
import { useDrop } from 'react-aria';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { flowsheetKeys } from '@/features/flowsheet/queries.ts';
import { movePlacement } from '@/features/flowsheet/domain/movePlacement.ts';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import clsx from 'clsx';

type DropIndicatorProps = {
  term: number;
  position: number;
};

export function DropIndicator({ term, position }: DropIndicatorProps) {
  const { flowsheet } = useFlowsheetContext();
  const { validTerms } = useFlowsheetGridContext();
  const queryClient = useQueryClient();

  const moveCourse = useMutation({
    mutationFn: flowsheetApi.moveCourse,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: flowsheetKeys.detail(flowsheet.id) });

      return queryClient.setQueryData(
        flowsheetKeys.detail(flowsheet.id),
        movePlacement(flowsheet, variables.courseId, term, position)
      );
    },
  });

  const ref = React.useRef(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,
    onDrop: async (e) => {
      const items = await Promise.all(
        e.items.filter((item) => item.kind === 'text' && item.types.has('courseId')).map(Number)
      );

      moveCourse.mutate({
        flowsheetId: flowsheet.id,
        courseId: items[0],
        term,
        position,
      });
    },
  });

  return (
    <div
      {...dropProps}
      ref={ref}
      className={clsx(styles.dropZone, validTerms ? styles.active : '')}
    >
      <div data-is-drop-target={isDropTarget} className={styles.indicator} />
    </div>
  );
}

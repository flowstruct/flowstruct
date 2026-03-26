import styles from './flowsheet-toolbar.module.css';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import { Button } from '@/shared/components/ui/Button';
import { Trash, X } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api';
import Group from '@/shared/components/layout/group';
import { Divider } from '@/shared/components/ui/divider';
import { Popover } from '@/shared/components/ui/Popover';
import React from 'react';

export function FlowsheetToolbar() {
  const { flowsheet } = useFlowsheetContext();
  const { state, dispatch } = useFlowsheetGridContext();
  const removeCourses = useMutation({
    mutationFn: (courseIds: number[]) =>
      flowsheetApi.removeCourses({
        flowsheetId: flowsheet.id,
        courseIds,
      }),
    onSuccess: () => {
      dispatch({ type: 'STOP' });
    },
  });
  const triggerRef = React.useRef<HTMLDivElement | null>(null);

  if (state.current !== 'SELECT') return null;

  return (
    <div className={styles.wrapper} ref={triggerRef}>
      <Popover
        triggerRef={triggerRef}
        isNonModal
        isOpen={state.courseIds.size > 0}
        className={styles.toolbar}
      >
        <Group gap={3}>
          <div className={styles.selectionCounter}>
            <Group>
              <p>{state.courseIds.size} selected</p>

              <Button
                variant="ghost"
                shape="icon"
                size="none"
                onPress={() => dispatch({ type: 'STOP' })}
              >
                <X size={14} />
              </Button>
            </Group>
          </div>

          <Divider orientation="vertical" />

          <Group>
            <TooltipTrigger>
              <Button
                shape="icon"
                size="sm"
                variant="flat"
                isPending={removeCourses.isPending}
                onPress={() => removeCourses.mutate(Array.from(state.courseIds))}
              >
                <Trash color="red" size={14} />
              </Button>

              <Tooltip>Remove courses</Tooltip>
            </TooltipTrigger>
          </Group>
        </Group>
      </Popover>
    </div>
  );
}

import styles from './flowsheet-toolbar.module.css';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { TagIcon, Trash, X } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import Group from '@/shared/components/layout/group.tsx';
import { Divider } from '@/shared/components/ui/divider.tsx';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import React from 'react';

export function FlowsheetToolbar() {
  const { flowsheet } = useFlowsheetContext();
  const { state, dispatch } = useFlowsheetGridContext();
  const removeCourses = useMutation({
    mutationFn: () =>
      flowsheetApi.removeCourses({
        flowsheetId: flowsheet.id,
        courseIds: Array.from(state.selected),
      }),
    onSuccess: () => {
      dispatch({ type: 'RESET_STATE' });
    },
  });
  const triggerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.wrapper} ref={triggerRef}>
      <Popover
        triggerRef={triggerRef}
        isNonModal
        isOpen={state.selected.size > 0}
        className={styles.toolbar}
      >
        <Group gap={3}>
          <div className={styles.selectionCounter}>
            <Group>
              <p>{state.selected.size} selected</p>

              <Button
                variant="ghost"
                shape="icon"
                size="none"
                onPress={() => dispatch({ type: 'CLEAR_SELECTED' })}
              >
                <X size={14} />
              </Button>
            </Group>
          </div>

          <Divider orientation="vertical" />

          <Group>
            <TooltipTrigger>
              <Button shape="icon" variant="flat" size="sm">
                <TagIcon size={14} />
              </Button>

              <Tooltip>Tag section</Tooltip>
            </TooltipTrigger>

            <TooltipTrigger>
              <Button
                shape="icon"
                size="sm"
                variant="flat"
                isPending={removeCourses.isPending}
                onPress={() => removeCourses.mutate()}
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

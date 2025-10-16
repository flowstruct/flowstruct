import styles from './flowsheet-toolbar.module.css';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { TagIcon, Trash, X } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import Group from '@/shared/components/layout/group.tsx';

export function FlowsheetToolbar() {
  const { flowsheet } = useFlowsheetContext();
  const { selectedCourses, clearSelectedCourses } = useFlowsheetGridContext();

  const removeCourses = useMutation({
    mutationFn: () =>
      flowsheetApi.removeCourses({
        flowsheetId: flowsheet.id,
        courseIds: Array.from(selectedCourses),
      }),
    onSuccess: () => {
      clearSelectedCourses();
    },
  });

  if (selectedCourses.size === 0) return;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Group>
          <div className={styles.selectionCounter}>
            <Group gap={2}>
              <p>{selectedCourses.size} selected</p>

              <Button
                variant="ghost"
                shape="icon"
                size="none"
                onPress={() => clearSelectedCourses()}
              >
                <X size={12} />
              </Button>
            </Group>
          </div>

          <TooltipTrigger>
            <Button variant="flat" shape="icon" size="xs">
              <TagIcon size={12} />
            </Button>

            <Tooltip>Remove courses</Tooltip>
          </TooltipTrigger>

          <TooltipTrigger>
            <Button
              variant="flat"
              shape="icon"
              size="xs"
              isPending={removeCourses.isPending}
              onPress={() => removeCourses.mutate()}
            >
              <Trash color="red" size={12} />
            </Button>

            <Tooltip>Remove courses</Tooltip>
          </TooltipTrigger>
        </Group>
      </div>
    </div>
  );
}

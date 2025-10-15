import styles from './flowsheet-toolbar.module.css';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Trash } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';

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
    meta: {
      successMessage: 'Removed courses.',
    },
  });

  if (selectedCourses.size === 0) return;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <TooltipTrigger>
          <Button
            variant="flat"
            size="icon"
            isPending={removeCourses.isPending}
            onPress={() => removeCourses.mutate()}
          >
            <Trash color="red" size={14} />
          </Button>

          <Tooltip>Remove courses</Tooltip>
        </TooltipTrigger>
      </div>
    </div>
  );
}

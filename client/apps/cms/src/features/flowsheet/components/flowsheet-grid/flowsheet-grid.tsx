import styles from './flowsheet-grid.module.css';
import { Grid2X2Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { FlowsheetToolbar } from '@/features/flowsheet/components/flowsheet-grid/flowsheet-toolbar.tsx';
import { createPortal } from 'react-dom';
import Group from '@/shared/components/layout/group.tsx';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { Box } from '@/shared/components/layout/box.tsx';
import { useKeyboard } from 'react-aria';
import { FlowsheetGridTerm } from '@/features/flowsheet/components/flowsheet-grid/flowsheet-grid-term.tsx';

export function FlowsheetGrid() {
  const { terms, createTerm, clearFocusedCourse, clearSelectedCourses } = useFlowsheetGridContext();
  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        clearSelectedCourses();
        clearFocusedCourse();
      }
    },
  });

  return (
    <Box overflow="auto" overflowY="hidden" {...keyboardProps}>
      <Group align="start">
        {Object.entries(terms).map(([term, placements]) => (
          <FlowsheetGridTerm
            key={term}
            term={Number(term)}
            placements={placements.sort((a, b) => a.position - b.position)}
          />
        ))}

        <Box position="relative">
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="xs"
              shape="icon"
              className={styles.addTermButton}
              onPress={createTerm}
            >
              <Grid2X2Plus size={15} />
            </Button>
            <Tooltip>Add term</Tooltip>
          </TooltipTrigger>
        </Box>
      </Group>

      {createPortal(<FlowsheetToolbar />, document.body)}
    </Box>
  );
}

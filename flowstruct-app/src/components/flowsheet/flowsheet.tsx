import styles from './flowsheet.module.css';
import { createPortal } from 'react-dom';
import { useKeyboard } from 'react-aria';
import { Box } from '../layout/box.tsx';
import Group from '../layout/group.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import { Button } from '../ui/Button.tsx';
import { Grid2X2Plus } from 'lucide-react';
import { MultiSelectToolbar } from './multi-select-toolbar.tsx';
import { Term } from './term.tsx';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';

export function Flowsheet() {
  const { allPossibleTerms, createTerm, clearFocusedCourse, clearSelectedCourses } =
    useFlowsheetGrid();
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
        {allPossibleTerms.map((t) => (
          <Term key={t.index} term={t} />
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

      {createPortal(<MultiSelectToolbar />, document.body)}
    </Box>
  );
}

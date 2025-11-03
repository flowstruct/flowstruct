import { Grid2X2Plus } from 'lucide-react';
import { useKeyboard } from 'react-aria';
import { createPortal } from 'react-dom';
import { useFlowsheetGridTerms } from '../../hooks/flowsheet-grid-terms.hook.ts';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import { Box } from '../layout/box.tsx';
import Group from '../layout/group.tsx';
import { Button } from '../ui/Button.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import styles from './flowsheet.module.css';
import { MultiSelectToolbar } from './multi-select-toolbar.tsx';
import { Term } from './term.tsx';

export function Flowsheet() {
  const { clearFocusedPlacement, clearSelectedPlacements } = useFlowsheetGrid();
  const { terms, createTerm } = useFlowsheetGridTerms();
  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        clearSelectedPlacements();
        clearFocusedPlacement();
      }
    },
  });

  return (
    <>
      <Box overflow="auto" overflowY="hidden" {...keyboardProps}>
        <Group align="start">
          {terms.map((t) => (
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
      </Box>

      {createPortal(<MultiSelectToolbar />, document.body)}
    </>
  );
}

import { Grid2X2Plus } from 'lucide-react';
import { useKeyboard, type Placement } from 'react-aria';
import { createPortal } from 'react-dom';
import { useDraggableCollectionState, useListState } from 'react-stately';
import { useFlowsheetGridTerms } from '../../hooks/flowsheet-grid-terms.hook.ts';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import { Box } from '../layout/box.tsx';
import Group from '../layout/group.tsx';
import { Button } from '../ui/Button.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import styles from './flowsheet.module.css';
import { MultiSelectToolbar } from './multi-select-toolbar.tsx';
import { Term } from './term.tsx';

export function Flowsheet(props) {
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

  const state = useListState(props);
  const dragState = useDraggableCollectionState<Placement>({
    ...props,
    colection: state.collection,
    selectionManager: state.selectionManager,
    getItems: (_, items) => {
      return items.map(i => {
        return {
          placement: JSON.stringify(i)
        }
      })
    }
  });

  return (
    <>
      <Box overflow="auto" overflowY="hidden" {...keyboardProps}>
        <Group align="start">
          {terms.map((t) => (
            <Term key={t.index} dragState={dragState} term={t} />
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

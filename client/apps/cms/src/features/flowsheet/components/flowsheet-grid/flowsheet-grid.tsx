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
import { Term } from '@/features/flowsheet/components/flowsheet-grid/term';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context';
import { TermProvider } from '@/features/flowsheet/contexts/term-context';

export function FlowsheetGrid() {
  const { flowsheet } = useFlowsheetContext();
  const { dispatch } = useFlowsheetGridContext();

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'RESET_STATE' });
      }
    },
  });

  return (
    <Box overflow="auto" overflowY="hidden" {...keyboardProps}>
      <Group align="start">
        {flowsheet.terms.map((t) => (
          <Term term={t} />
        ))}

        <Box position="relative">
          <TooltipTrigger>
            <Button variant="ghost" size="xs" shape="icon" className={styles.addTermButton}>
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

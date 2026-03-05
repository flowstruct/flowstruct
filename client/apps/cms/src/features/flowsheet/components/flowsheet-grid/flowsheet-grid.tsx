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
import { DragDropProvider } from '@dnd-kit/react';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api';

export function FlowsheetGrid() {
  const { dispatch } = useFlowsheetGridContext();
  const { flowsheet } = useFlowsheetContext();

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'RESET_STATE' });
      }
    },
  });

  return (
    <Box className={styles.grid} overflow="auto" overflowY="hidden" {...keyboardProps}>
      <Group align="start">
        <DragDropProvider>
          {flowsheet.terms.map((t) => (
            <TermProvider key={t.id} term={t}>
              <Term />
            </TermProvider>
          ))}
        </DragDropProvider>

        <AddTermButton />
      </Group>

      {createPortal(<FlowsheetToolbar />, document.body)}
    </Box>
  );
}

function AddTermButton() {
  const { flowsheet } = useFlowsheetContext();
  const addTerm = useMutation({
    mutationFn: () => flowsheetApi.addTerm({ flowsheetId: flowsheet.id }),
  });

  return (
    <Box position="relative">
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="xs"
          shape="icon"
          className={styles.addTermButton}
          onPress={() => addTerm.mutate()}
          isPending={addTerm.isPending}
        >
          <Grid2X2Plus size={15} />
        </Button>

        <Tooltip>Add term</Tooltip>
      </TooltipTrigger>
    </Box>
  );
}

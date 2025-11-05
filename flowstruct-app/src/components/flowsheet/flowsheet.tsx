import { closestCenter, defaultDropAnimationSideEffects, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DropAnimation } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Grid2X2Plus } from 'lucide-react';
import { useKeyboard } from 'react-aria';
import { createPortal } from 'react-dom';
import { useFlowsheetGridTerms } from '../../hooks/flowsheet-grid-terms.hook.ts';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import { Box } from '../layout/box.tsx';
import Group from '../layout/group.tsx';
import { Button } from '../ui/Button.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import { CoursePlacementPreview } from './course-placement.tsx';
import styles from './flowsheet.module.css';
import { MultiSelectToolbar } from './multi-select-toolbar.tsx';
import { Term } from './term.tsx';

export function Flowsheet() {
  const { clearFocusedPlacement, clearSelectedPlacements, onMovePlacement, movingPlacement } = useFlowsheetGrid();
  const { terms, createTerm } = useFlowsheetGridTerms();
  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        clearSelectedPlacements();
        clearFocusedPlacement();
      }
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    onMovePlacement(active.data.current?.placement);
  }

  const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={() => { }} onDragEnd={handleDragEnd}>
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

      <DragOverlay adjustScale={true} dropAnimation={dropAnimationConfig}>
        {movingPlacement && (
          <CoursePlacementPreview
            courseId={
              movingPlacement.type === 'COURSE'
                ? movingPlacement.course
                : 'N/A'
            }
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

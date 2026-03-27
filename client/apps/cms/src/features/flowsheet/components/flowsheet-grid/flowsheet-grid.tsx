import styles from './flowsheet-grid.module.css';
import { Grid2X2Plus, Trash } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip';
import { FlowsheetToolbar } from '@/features/flowsheet/components/flowsheet-grid/flowsheet-toolbar';
import { createPortal } from 'react-dom';
import Group from '@/shared/components/layout/group';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context';
import { Box } from '@/shared/components/layout/box';
import { Text } from '@/shared/components/layout/text';
import { useKeyboard } from 'react-aria';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context';
import { TermProvider, useTermContext } from '@/features/flowsheet/contexts/term-context';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api';
import { usePlacementMoveContext } from '@/features/flowsheet/contexts/placement-move-context';
import { Stack } from '@/shared/components/layout/stack';
import { getTermDisplayName } from '@/features/flowsheet/domain/getTermDisplayName';
import { CourseCatalogAutocomplete } from '@/features/flowsheet/components/flowsheet-grid/course-catalog-autocomplete';
import { Placement } from '@/features/flowsheet/domain/flowsheet';
import { useDelayedSkeleton } from '@/shared/hooks/use-delayed-skeleton';
import { flowsheetQueries } from '@/features/flowsheet/queries';
import { CourseCard } from '@/features/flowsheet/components/flowsheet-grid/course-card';

export function FlowsheetGrid() {
  const { dispatch } = useFlowsheetGridContext();
  const { dragHandlers } = usePlacementMoveContext();
  const { flowsheet } = useFlowsheetContext();

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'RESET' });
      }
    },
  });

  return (
    <Box className={styles.grid} {...keyboardProps}>
      <Group
        align="start"
        onDragOver={dragHandlers.onDragOver}
        onDragLeave={dragHandlers.onDragLeave}
      >
        {flowsheet.terms.map((t) => (
          <TermProvider key={t.id} term={t}>
            <Term />
          </TermProvider>
        ))}

        <Stack>
          <AddTermButton />
          <RemoveTermButton />
        </Stack>
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

        <Tooltip placement="right">Add term</Tooltip>
      </TooltipTrigger>
    </Box>
  );
}

function RemoveTermButton() {
  const { flowsheet } = useFlowsheetContext();
  const removeTerm = useMutation({
    mutationFn: () => flowsheetApi.deleteLastTerm({ flowsheetId: flowsheet.id }),
  });

  if (flowsheet.terms.length === 0) return null;

  return (
    <Box position="relative">
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="xs"
          shape="icon"
          className={styles.addTermButton}
          onPress={() => removeTerm.mutate()}
          isPending={removeTerm.isPending}
        >
          <Trash size={15} />
        </Button>

        <Tooltip placement="right">Delete term</Tooltip>
      </TooltipTrigger>
    </Box>
  );
}

export function Term() {
  const { term } = useTermContext();

  return (
    <Stack gap={1}>
      <Box px={1}>
        <Text tone="dimmed" align="center" weight="medium" size="xs">
          {getTermDisplayName(term)}
        </Text>
      </Box>

      <div className={styles.placements}>
        {term.placements.map((p) => (
          <PlacementCard key={p.course} placement={p} />
        ))}
        <DropIndicator last position={term.placements.length + 1} />
      </div>

      <CourseCatalogAutocomplete />
    </Stack>
  );
}

type DropIndicatorProps = {
  last?: boolean;
  position: number;
};

export function DropIndicator({ last = false, position }: DropIndicatorProps) {
  const { term } = useTermContext();
  const { allowedTerms } = usePlacementMoveContext();

  return (
    <div
      data-position={position}
      data-term-id={term.id}
      data-disabled={!allowedTerms.has(term.id)}
      className={styles.dropIndicator}
      style={last && term.placements.length > 0 ? { bottom: '-0.35rem' } : { top: '-0.35rem' }}
    />
  );
}

type PlacementCardProps = {
  placement: Placement;
};

function PlacementCard({ placement }: PlacementCardProps) {
  const { flowsheet, flowsheetCourses } = useFlowsheetContext();
  const showSkeleton = useDelayedSkeleton(flowsheetQueries.courseCollection(flowsheet.id));
  const course = flowsheetCourses.byIds[placement.course];

  if (!course) {
    return showSkeleton && <div className={styles.skeletonCard} />;
  }

  return (
    <div className={styles.placementCard}>
      <DropIndicator position={placement.position} />
      <CourseCard key={course.id} course={course} placement={placement} />
    </div>
  );
}

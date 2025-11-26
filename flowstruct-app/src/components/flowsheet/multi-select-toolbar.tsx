import { TagIcon, Trash, X } from 'lucide-react';
import React from 'react';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import Group from '../layout/group.tsx';
import { Button } from '../ui/Button.tsx';
import { Divider } from '../ui/divider.tsx';
import { Popover } from '../ui/Popover.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import styles from './multi-select-toolbar.module.css';
import { deletePlacements } from '../../domain/placement.ts';
import { usePlacements } from '../../hooks/placements.hook.tsx';
import { useCourses } from '../../hooks/courses.hook.tsx';

export function MultiSelectToolbar() {
  const { selectedPlacements, focusedPlacement, clearSelectedPlacements, clearFocusedPlacement } =
    useFlowsheetGrid();

  const { placements, setPlacements } = usePlacements();
  const { courses, setCourses } = useCourses();

  const triggerRef = React.useRef<HTMLDivElement | null>(null);

  const handleDeletePlacements = () => {
    const deletePlacementsResult = deletePlacements({
      courses,
      placements,
      placementIds: Array.from(selectedPlacements),
    });

    if (focusedPlacement && selectedPlacements.has(focusedPlacement.id)) {
      clearFocusedPlacement();
    }

    clearSelectedPlacements();
    setPlacements(deletePlacementsResult.placements);
    setCourses(deletePlacementsResult.courses);
  };

  return (
    <div className={styles.wrapper} ref={triggerRef}>
      <Popover
        triggerRef={triggerRef}
        isNonModal
        isOpen={selectedPlacements.size > 0}
        className={styles.toolbar}
      >
        <Group gap={3}>
          <div className={styles.selectionCounter}>
            <Group>
              <p>{selectedPlacements.size} selected</p>

              <Button
                variant="ghost"
                shape="icon"
                size="none"
                onPress={() => clearSelectedPlacements()}
              >
                <X size={14} />
              </Button>
            </Group>
          </div>

          <Divider orientation="vertical" />

          <Group>
            <TooltipTrigger>
              <Button shape="icon" variant="flat" size="sm">
                <TagIcon size={14} />
              </Button>

              <Tooltip>Tag section</Tooltip>
            </TooltipTrigger>

            <TooltipTrigger>
              <Button shape="icon" size="sm" variant="flat" onPress={handleDeletePlacements}>
                <Trash color="red" size={14} />
              </Button>

              <Tooltip>Remove courses</Tooltip>
            </TooltipTrigger>
          </Group>
        </Group>
      </Popover>
    </div>
  );
}

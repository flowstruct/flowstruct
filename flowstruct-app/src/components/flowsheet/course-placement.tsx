import styles from './course-placement.module.css';
import { Pencil, Plus, Scaling, TagIcon, Trash } from 'lucide-react';
import { useFocusRing, useHover, usePress } from 'react-aria';
import clsx from 'clsx';
import React from 'react';
import { Stack } from '../layout/stack.tsx';
import { Checkbox } from '../ui/Checkbox.tsx';
import Group from '../layout/group.tsx';
import { Popover } from '../ui/Popover.tsx';
import { Box } from '../layout/box.tsx';
import { Button } from '../ui/Button.tsx';
import { Divider } from '../ui/divider.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import type { Course } from '../../domain/course.ts';
import { Text } from '../layout/text.tsx';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import type { Placement } from '../../domain/flowsheet.ts';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { deletePlacements } from '../../domain/placement.ts';

type CourseCardProps = {
  course: Course;
  placement: Placement;
};

export function CoursePlacement({ course, placement, ...props }: CourseCardProps) {
  const {
    isFocusedPlacement,
    toggleSelectedPlacement,
    toggleFocusPlacement,
    isSelectedPlacement,
    clearFocusedPlacement,
  } = useFlowsheetGrid();

  const { pressProps, isPressed } = usePress({
    onPress: (e) => {
      if (e.shiftKey || e.ctrlKey) {
        toggleSelectedPlacement(placement.id);
        return;
      }

      toggleFocusPlacement(placement.id);
    },
  });
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocusVisible } = useFocusRing(props);

  const triggerFocusPopoverRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        {...pressProps}
        {...hoverProps}
        {...focusProps}
        className={clsx(
          styles.card,
          isFocusedPlacement(placement.id) ? styles.focused : '',
          isSelectedPlacement(placement.id) ? styles.selected : ''
        )}
        data-hovered={isHovered || undefined}
        data-focused={isFocusVisible || undefined}
        data-pressed={isPressed || undefined}
        role="button"
        tabIndex={0}
        ref={triggerFocusPopoverRef}
      >
        <Stack fill gap={1}>
          <Group justify="between">
            <Text as="h3" size="xs" tone="dimmed" weight="medium" className={styles.code}>
              {course.code}
            </Text>

            <Checkbox
              onChange={() => toggleSelectedPlacement(placement.id)}
              isSelected={isSelectedPlacement(placement.id)}
            />
          </Group>

          <Text size="xs">{course.name}</Text>
        </Stack>
      </div>

      <Popover
        triggerRef={triggerFocusPopoverRef}
        placement="top"
        onOpenChange={(isOpen) =>
          isOpen ? clearFocusedPlacement() : toggleFocusPlacement(placement.id)
        }
        isOpen={isFocusedPlacement(placement.id)}
      >
        <CoursePlacementToolbar placement={placement} />
      </Popover>
    </>
  );
}

type CoursePlacementToolbarProps = {
  placement: Placement;
};

function CoursePlacementToolbar({ placement }: CoursePlacementToolbarProps) {
  const { setFlowsheet } = useFlowsheet();
  const { clearFocusedPlacement, selectedPlacements, toggleSelectedPlacement } = useFlowsheetGrid();

  const handleDeletePlacement = () => {
    setFlowsheet((flowsheet) => deletePlacements({ flowsheet, placementIds: [placement.id] }));

    clearFocusedPlacement();

    if (selectedPlacements.has(placement.id)) {
      toggleSelectedPlacement(placement.id);
    }
  };

  return (
    <Box px={1} py={1}>
      <Group gap={1}>
        <Button size="sm" variant="transparent">
          <Plus size={14} /> Prerequisite
        </Button>

        <Button size="sm" variant="transparent">
          <Plus size={14} /> Corequisite
        </Button>

        <Divider orientation="vertical" />

        <TooltipTrigger>
          <Button size="sm" shape="icon" variant="transparent">
            <TagIcon size={14} />
          </Button>

          <Tooltip>Assign section</Tooltip>
        </TooltipTrigger>

        <TooltipTrigger>
          <Button size="sm" shape="icon" variant="transparent">
            <Scaling size={14} />
          </Button>

          <Tooltip>Resize</Tooltip>
        </TooltipTrigger>

        <TooltipTrigger>
          <Button size="sm" shape="icon" variant="transparent">
            <Pencil size={14} />
          </Button>

          <Tooltip>Edit</Tooltip>
        </TooltipTrigger>

        <Divider orientation="vertical" />

        <TooltipTrigger>
          <Button size="sm" shape="icon" variant="transparent" onPress={handleDeletePlacement}>
            <Trash color="red" size={14} />
          </Button>

          <Tooltip>Remove</Tooltip>
        </TooltipTrigger>
      </Group>
    </Box>
  );
}

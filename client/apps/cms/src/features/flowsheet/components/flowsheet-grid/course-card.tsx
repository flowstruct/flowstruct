import { CourseSummary } from '@/features/course/domain/course.ts';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { Placement } from '@/features/flowsheet/domain/flowsheet';
import { usePlacement } from '@/features/flowsheet/hooks/use-placement';
import { Box } from '@/shared/components/layout/box.tsx';
import Group from '@/shared/components/layout/group.tsx';
import { Stack } from '@/shared/components/layout/stack.tsx';
import { Text } from '@/shared/components/layout/text.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Checkbox } from '@/shared/components/ui/Checkbox.tsx';
import { Divider } from '@/shared/components/ui/divider.tsx';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';
import { Plus, Scaling, TagIcon, Trash } from 'lucide-react';
import React from 'react';
import { useFocusRing, useHover, usePress } from 'react-aria';
import styles from './course-card.module.css';
import { useSortable } from '@dnd-kit/react/sortable';
import { useTermContext } from '@/features/flowsheet/contexts/term-context';

type CourseCardProps = {
  course: CourseSummary;
  placement: Placement;
};

export function CourseCard({ course, placement, ...props }: CourseCardProps) {
  const { state, dispatch } = useFlowsheetGridContext();
  const { term } = useTermContext();
  const triggerFocusPopoverRef = React.useRef<HTMLDivElement | null>(null);
  const placementState = usePlacement(placement);
  const { ref, isDragging } = useSortable({
    id: course.id,
    index: placement.position,
    type: 'placement',
    accept: 'placement',
    group: term.id,
  });
  const { pressProps, isPressed } = usePress({
    onPress: (e) => {
      if ((e.ctrlKey || e.shiftKey) && placementState === 'NORMAL') {
        dispatch({ type: 'TOGGLE_SELECT', payload: { courseId: course.id } });
        return;
      }

      if (placementState === 'SELECTABLE' || placementState === 'SELECTED') {
        dispatch({ type: 'TOGGLE_SELECT', payload: { courseId: course.id } });
      }

      if (
        placementState === 'PREREQ_LINK' ||
        (placementState === 'AVAILABLE_LINK' && state.linkType === 'PREREQ')
      ) {
        console.log('toggled prereq');
        return;
      }

      if (
        placementState === 'COREQ_LINK' ||
        (placementState === 'AVAILABLE_LINK' && state.linkType === 'COREQ')
      ) {
        console.log('toggled coreq');
        return;
      }

      if (placementState === 'LINK_SOURCE') {
        dispatch({ type: 'TOGGLE_LINKING', payload: { courseId: course.id, type: null } });
        return;
      }

      if (state.focused || placementState === 'NORMAL') {
        dispatch({ type: 'TOGGLE_FOCUS', payload: { courseId: course.id } });
        return;
      }
    },
  });
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocusVisible } = useFocusRing(props);

  return (
    <div ref={ref}>
      <div
        {...pressProps}
        {...hoverProps}
        {...focusProps}
        className={styles.card}
        data-hovered={isHovered || undefined}
        data-focused={isFocusVisible || undefined}
        data-pressed={isPressed || undefined}
        data-dragging={isDragging}
        data-state={placementState}
        role="button"
        tabIndex={0}
        ref={triggerFocusPopoverRef}
      >
        <Stack fill gap={1}>
          <Group justify="between">
            <Text as="h3" size="xs" tone="dimmed" weight="medium">
              {course.code}
            </Text>

            <Checkbox
              onChange={() => dispatch({ type: 'TOGGLE_SELECT', payload: { courseId: course.id } })}
              isSelected={state.selected.has(course.id)}
            />
          </Group>

          <Text size="xs">{course.name}</Text>
        </Stack>
      </div>

      <Popover
        triggerRef={triggerFocusPopoverRef}
        isNonModal
        placement="top"
        isOpen={state.focused === course.id}
      >
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

            <Divider orientation="vertical" />

            <TooltipTrigger>
              <Button size="sm" shape="icon" variant="transparent">
                <Trash color="red" size={14} />
              </Button>

              <Tooltip>Remove</Tooltip>
            </TooltipTrigger>
          </Group>
        </Box>
      </Popover>
    </div>
  );
}

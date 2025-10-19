import { CourseSummary } from '@/features/course/domain/course.ts';
import styles from './course-card.module.css';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { Plus, Scaling, TagIcon, Trash } from 'lucide-react';
import Group from '@/shared/components/layout/group.tsx';
import { Stack } from '@/shared/components/layout/stack.tsx';
import { useFocusRing, useHover, usePress } from 'react-aria';
import clsx from 'clsx';
import React from 'react';
import { Text } from '@/shared/components/layout/text.tsx';
import { Checkbox } from '@/shared/components/ui/Checkbox.tsx';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { Box } from '@/shared/components/layout/box.tsx';
import { Divider } from '@/shared/components/ui/divider.tsx';
import { Tooltip, TooltipTrigger } from '@/shared/components/ui/Tooltip.tsx';

type CourseCardProps = {
  course: CourseSummary;
};

export function CourseCard({ course, ...props }: CourseCardProps) {
  const { isFocusedCourse, toggleSelectCourse, toggleFocusCourse, isSelectedCourse } =
    useFlowsheetGridContext();

  const { pressProps, isPressed } = usePress({
    onPress: (e) => {
      if (e.shiftKey || e.ctrlKey) {
        toggleSelectCourse(course.id);
        return;
      }

      toggleFocusCourse(course.id);
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
          isFocusedCourse(course.id) ? styles.focused : '',
          isSelectedCourse(course.id) ? styles.selected : ''
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
            <Text as="h3" size="xs" tone="dimmed" weight="medium">
              {course.code}
            </Text>

            <Checkbox
              onChange={() => toggleSelectCourse(course.id)}
              isSelected={isSelectedCourse(course.id)}
            />
          </Group>

          <Text size="xs">{course.name}</Text>
        </Stack>
      </div>

      <Popover
        triggerRef={triggerFocusPopoverRef}
        isNonModal
        placement="top"
        isOpen={isFocusedCourse(course.id)}
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
    </>
  );
}

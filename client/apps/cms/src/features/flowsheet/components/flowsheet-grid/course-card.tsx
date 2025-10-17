import { CourseSummary } from '@/features/course/domain/course.ts';
import styles from './course-card.module.css';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { GripVertical, TagIcon, Trash, Workflow } from 'lucide-react';
import Group from '@/shared/components/layout/group.tsx';
import { Stack } from '@/shared/components/layout/stack.tsx';
import { DragPreview, useDrag } from 'react-aria';
import clsx from 'clsx';
import React from 'react';
import { Text } from '@/shared/components/layout/text.tsx';
import { Checkbox } from '@/shared/components/ui/Checkbox.tsx';

type CourseCardProps = {
  course: CourseSummary;
};

export function CourseCard({ course }: CourseCardProps) {
  const {
    focusedCourse,
    toggleFocusCourse,
    toggleSelectCourse,
    isSelected,
    isFocused,
    onDragCourse,
    clearDraggingCourse,
    selectedCourses,
  } = useFlowsheetGridContext();

  const dragPreview = React.useRef(null);

  const { dragProps, isDragging } = useDrag({
    preview: dragPreview,
    getItems() {
      return [];
    },
    onDragStart: () => {
      onDragCourse(course.id);
    },
    onDragEnd: () => {
      clearDraggingCourse();
    },
  });

  return (
    <>
      <UnstyledButton
        onPress={() => {
          if (isFocused(course.id)) {
            toggleFocusCourse(course.id);
            return;
          }

          toggleSelectCourse(course.id);
        }}
        className={clsx(styles.card, isDragging ? styles.dragging : '')}
        data-focused-course={isFocused(course.id) ? true : undefined}
        data-selected-course={isSelected(course.id) ? true : undefined}
      >
        <Stack fill gap={1} {...dragProps}>
          <Group justify="between">
            <Text as="h3" size="xs" tone="dimmed" weight="medium">
              {course.code}
            </Text>

            <Checkbox
              onChange={() => toggleSelectCourse(course.id)}
              isSelected={isSelected(course.id)}
            />
          </Group>

          <Text size="xs">{course.name}</Text>

          {selectedCourses.size === 0 && focusedCourse === null && (
            <Group justify="end" className={clsx(styles.footerButtons)}>
              <Button
                variant="ghost"
                size="xs"
                shape="icon"
                onPress={() => toggleFocusCourse(course.id)}
              >
                <Workflow size={15} />
              </Button>

              <Button variant="ghost" size="xs" shape="icon">
                <TagIcon size={14} />
              </Button>

              <Button variant="ghost" size="xs" shape="icon">
                <Trash size={14} />
              </Button>
            </Group>
          )}
        </Stack>
      </UnstyledButton>

      <DragPreview ref={dragPreview}>
        {() => (
          <div className={styles.dragPreview}>
            <GripVertical size={18} />
            <Text size="xs" weight="semibold">
              {course.code}
            </Text>
          </div>
        )}
      </DragPreview>
    </>
  );
}

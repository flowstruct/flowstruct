import styles from './course-placement.module.css';
import { Pencil, Plus, Scaling, TagIcon, Trash } from 'lucide-react';
import { mergeProps, useDraggableItem, useFocusRing, useHover, useKeyboard, usePress } from 'react-aria';
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
import { type Course, editCourse } from '../../domain/course.ts';
import { Text } from '../layout/text.tsx';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import type { Placement } from '../../domain/flowsheet.ts';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { deletePlacements } from '../../domain/placement.ts';
import { useForm } from '../../hooks/form.hook.ts';
import { handleSubmit } from '../../utils/handle-submit.ts';
import { CoursePlacementForm } from './course-placement-form.tsx';
import { handleFormKeyboardActions } from '../../utils/handleFormKeyboardActions.ts';
import type { DraggableCollectionState } from 'react-stately';

type CourseCardProps = {
  course: Course;
  placement: Placement;
  dragState: DraggableCollectionState;
};

export function CoursePlacement({ course, placement, dragState, ...props }: CourseCardProps) {
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
  const { dragProps } = useDraggableItem({ key: placement.id }, dragState);

  const [editCourse, setEditCourse] = React.useState<boolean>(false);

  const toggleEditCourse = () => (editCourse ? setEditCourse(false) : setEditCourse(true));

  const coursePlacementRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <>
      {editCourse ? (
        <EditCoursePlacement course={course} toggleEditCourse={toggleEditCourse} />
      ) : (
        <div
          {...mergeProps(pressProps, hoverProps, focusProps, dragProps)}
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
          ref={coursePlacementRef}
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
      )}

      <Popover
        triggerRef={coursePlacementRef}
        placement="top"
        onOpenChange={(isOpen) =>
          isOpen ? clearFocusedPlacement() : toggleFocusPlacement(placement.id)
        }
        isOpen={isFocusedPlacement(placement.id)}
      >
        <CoursePlacementToolbar placement={placement} toggleEditCourse={toggleEditCourse} />
      </Popover>
    </>
  );
}

type CoursePlacementToolbarProps = {
  placement: Placement;
  toggleEditCourse: () => void;
};

function CoursePlacementToolbar({ placement, toggleEditCourse }: CoursePlacementToolbarProps) {
  const { setFlowsheet } = useFlowsheet();
  const { clearFocusedPlacement, selectedPlacements, toggleSelectedPlacement } = useFlowsheetGrid();

  const handleDeletePlacement = () => {
    setFlowsheet((flowsheet) => deletePlacements({ flowsheet, placementIds: [placement.id] }));

    clearFocusedPlacement();

    if (selectedPlacements.has(placement.id)) {
      toggleSelectedPlacement(placement.id);
    }
  };

  const handleEditCourse = () => {
    toggleEditCourse();
    clearFocusedPlacement();
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
          <Button size="sm" shape="icon" variant="transparent" onPress={handleEditCourse}>
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

type EditCoursePlacementProps = {
  course: Course;
  toggleEditCourse: () => void;
};

function EditCoursePlacement({ course, toggleEditCourse }: EditCoursePlacementProps) {
  const { setFlowsheet } = useFlowsheet();
  const form = useForm(course);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      handleFormKeyboardActions(e, toggleEditCourse);
    },
  });

  const onSubmit = handleSubmit<Course>(() => {
    const course: Course = {
      ...form.data,
      code: form.data.code.toUpperCase(),
    };

    setFlowsheet((flowsheet) => editCourse({ flowsheet, updatedCourse: course }));

    form.reset();
    toggleEditCourse();
  });

  return (
    <div {...keyboardProps}>
      <CoursePlacementForm onSubmit={onSubmit} form={form} onClose={toggleEditCourse} />
    </div>
  );
}

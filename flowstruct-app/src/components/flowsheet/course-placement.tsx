import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { Ellipsis, Grip, Pencil, Plus, Scaling, TagIcon, Trash } from 'lucide-react';
import React from 'react';
import { useFocusRing, useHover, useKeyboard, usePress } from 'react-aria';
import { type Course, editCourse } from '../../domain/course.ts';
import type { Placement } from '../../domain/flowsheet.ts';
import { deletePlacements } from '../../domain/placement.ts';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { useForm } from '../../hooks/form.hook.ts';
import { handleSubmit } from '../../utils/handle-submit.ts';
import { handleFormKeyboardActions } from '../../utils/handleFormKeyboardActions.ts';
import { Box } from '../layout/box.tsx';
import Group from '../layout/group.tsx';
import { Stack } from '../layout/stack.tsx';
import { Text } from '../layout/text.tsx';
import { Button } from '../ui/Button.tsx';
import { Checkbox } from '../ui/Checkbox.tsx';
import { Divider } from '../ui/divider.tsx';
import { Popover } from '../ui/Popover.tsx';
import { Tooltip, TooltipTrigger } from '../ui/Tooltip.tsx';
import { CoursePlacementForm } from './course-placement-form.tsx';
import styles from './course-placement.module.css';

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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: placement.id });

  const coursePlacementRef = React.useRef<HTMLDivElement | null>(null);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const toggleEditCourse = () => setEditMode((prev) => !prev);

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      {editMode ? (
        <EditCoursePlacement course={course} toggleEditCourse={toggleEditCourse} />
      ) : (
        <div ref={setNodeRef} style={cardStyle}>
          <div
            className={clsx(
              styles.card,
              isFocusedPlacement(placement.id) && styles.focused,
              isSelectedPlacement(placement.id) && styles.selected
            )}
            data-hovered={isHovered || undefined}
            data-focused={isFocusVisible || undefined}
            data-pressed={isPressed || undefined}
            role="button"
            tabIndex={0}
          >
            <Stack fill gap={1}>
              <Stack fill>
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

              <Group justify="between">

                <Grip color="gray" {...attributes} {...listeners} size={14} />
                <Button shape="icon" size="none" variant="ghost" ref={coursePlacementRef} onPress={() => toggleFocusPlacement(placement.id)}>
                  <Ellipsis color="gray" size={14} />
                </Button>
              </Group>
            </Stack>
          </div>
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
    onKeyDown: (e) => handleFormKeyboardActions(e, toggleEditCourse),
  });

  const onSubmit = handleSubmit<Course>(() => {
    const updatedCourse: Course = {
      ...form.data,
      code: form.data.code.toUpperCase(),
    };
    setFlowsheet((flowsheet) => editCourse({ flowsheet, updatedCourse }));
    form.reset();
    toggleEditCourse();
  });

  return (
    <div {...keyboardProps}>
      <CoursePlacementForm onSubmit={onSubmit} form={form} onClose={toggleEditCourse} />
    </div>
  );
}


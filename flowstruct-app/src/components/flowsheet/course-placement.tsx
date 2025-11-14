import { useSortable } from '@dnd-kit/react/sortable';
import clsx from 'clsx';
import { ChevronDown, GripHorizontal, Pencil, Plus, Scaling, TagIcon, Trash } from 'lucide-react';
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
import Group from '../layout/group.tsx';
import { Stack } from '../layout/stack.tsx';
import { Text } from '../layout/text.tsx';
import { Button } from '../ui/Button.tsx';
import { Checkbox } from '../ui/Checkbox.tsx';
import { Menu, MenuItem } from '../ui/Menu.tsx';
import { Popover } from '../ui/Popover.tsx';
import { CoursePlacementForm } from './course-placement-form.tsx';
import styles from './course-placement.module.css';

type CourseCardProps = {
  course: Course;
  placement: Placement;
  index: number;
};

export function CoursePlacement({ course, placement, index, ...props }: CourseCardProps) {
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
      }
    },
  });
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocusVisible } = useFocusRing(props);

  const { ref } = useSortable({
    id: placement.id,
    data: { placement },
    index,
    group: placement.term,
    collisionPriority: 1,
  });

  const [editMode, setEditMode] = React.useState<boolean>(false);
  const triggerMenuRef = React.useRef<HTMLDivElement | null>(null);

  const toggleEditCourse = () => setEditMode((prev) => !prev);

  return (
    <>
      {editMode ? (
        <EditCoursePlacement course={course} toggleEditCourse={toggleEditCourse} />
      ) : (
        <div ref={ref}>
          <div
            className={clsx(
              styles.card,
              isFocusedPlacement(placement.id) && styles.focused,
              isSelectedPlacement(placement.id) && styles.selected
            )}
            {...pressProps}
            {...focusProps}
            {...hoverProps}
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

                  <Button
                    ref={triggerMenuRef}
                    shape="icon"
                    size="none"
                    variant="transparent"
                    onPress={() => toggleFocusPlacement(placement.id)}
                  >
                    <ChevronDown
                      color="gray"
                      style={{
                        rotate: isFocusedPlacement(placement.id) ? '180deg' : '',
                        transition: '250ms ease-in-out',
                      }}
                      size={15}
                    />
                  </Button>
                </Group>

                <Text size="xs">{course.name}</Text>
              </Stack>

              <Group justify="between">
                <div>
                  <GripHorizontal color="gray" size={15} />
                </div>

                <Checkbox
                  onChange={() => toggleSelectedPlacement(placement.id)}
                  isSelected={isSelectedPlacement(placement.id)}
                />
              </Group>
            </Stack>
          </div>
        </div>
      )}

      <Popover
        triggerRef={triggerMenuRef}
        isNonModal
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
    <>
      <Menu>
        <MenuItem>
          <Plus size={14} /> Prerequisite
        </MenuItem>

        <MenuItem>
          <Plus size={14} /> Corequisite
        </MenuItem>

        <MenuItem>
          <TagIcon size={14} /> Assign section
        </MenuItem>

        <MenuItem>
          <Scaling size={14} /> Resize
        </MenuItem>

        <MenuItem onPress={handleEditCourse}>
          <Pencil size={14} /> Edit
        </MenuItem>

        <MenuItem onPress={handleDeletePlacement}>
          <Trash color="red" size={14} /> Remove
        </MenuItem>
      </Menu>
    </>
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

type CoursePlacementPreviewProps = {
  courseId: string;
};

export function CoursePlacementPreview({ courseId }: CoursePlacementPreviewProps) {
  const { flowsheet } = useFlowsheet();
  const course = flowsheet.courses[courseId];

  if (!course) {
    return null;
  }

  return (
    <div className={styles.card}>
      <Stack fill gap={1}>
        <Stack fill>
          <Group justify="between">
            <Text as="h3" size="xs" tone="dimmed" weight="medium" className={styles.code}>
              {course.code}
            </Text>

            <ChevronDown size={15} />
          </Group>

          <Text size="xs">{course.name}</Text>
        </Stack>

        <Group justify="between">
          <GripHorizontal color="gray" size={15} />

          <Checkbox />
        </Group>
      </Stack>
    </div>
  );
}

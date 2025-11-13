import { ChevronDown, GripHorizontal, Pencil, Plus, Scaling, TagIcon, Trash } from 'lucide-react';
import React from 'react';
import { mergeProps, useKeyboard, usePress } from 'react-aria';
import { editCourse, type Course } from '../../domain/course.ts';
import type { Placement } from '../../domain/flowsheet.ts';
import { deletePlacements } from '../../domain/placement.ts';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import { useFlowsheet } from '../../hooks/flowsheet.hook.tsx';
import { useForm } from '../../hooks/form.hook.ts';
import { usePlacementItem } from '../../hooks/placement-item.hook.tsx';
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

export function CourseCard({ course, placement }: CourseCardProps) {
  const {
    isFocusedPlacement,
    toggleSelectedPlacement,
    toggleFocusPlacement,
    isSelectedPlacement,
    clearFocusedPlacement,
  } = useFlowsheetGrid();

  const triggerMenuRef = React.useRef<HTMLDivElement | null>(null);
  const [editCourse, setEditCourse] = React.useState<boolean>(false);

  const { pressProps } = usePress({
    onPress: (e) => {
      if (e.shiftKey || e.ctrlKey) {
        toggleSelectedPlacement(placement.id);
        return;
      }

      toggleFocusPlacement(placement.id);
    },
  });
  const toggleEditCourse = () => (editCourse ? setEditCourse(false) : setEditCourse(true));

  return (
    <>
      {editCourse ? (
        <EditCoursePlacement course={course} toggleEditCourse={toggleEditCourse} />
      ) : (
        <div className={styles.card} tabIndex={0} ref={triggerMenuRef} {...pressProps}>
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
      )}

      <Popover
        triggerRef={triggerMenuRef}
        placement="top"
        onOpenChange={(isOpen) =>
          isOpen ? clearFocusedPlacement() : toggleFocusPlacement(placement.id)
        }
        isOpen={isFocusedPlacement(placement.id)}
      >
        <MenuActions placement={placement} toggleEditCourse={toggleEditCourse} />
      </Popover>
    </>
  );
}

type MenuActionsProps = {
  placement: Placement;
  toggleEditCourse: () => void;
};

function MenuActions({ placement, toggleEditCourse }: MenuActionsProps) {
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

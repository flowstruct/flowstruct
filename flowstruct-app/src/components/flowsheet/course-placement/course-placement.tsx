import clsx from 'clsx';
import { EllipsisVertical, GripHorizontal, Pencil, Plus, Trash } from 'lucide-react';
import { useFocusRing, useHover, usePress, type PressEvent } from 'react-aria';
import { canSelectPrerequisite, type Course } from '../../../domain/course.ts';
import { classifyRelationship, type Relationship } from '../../../domain/courses-graph.ts';
import type { Placement } from '../../../domain/flowsheet.ts';
import { deletePlacements } from '../../../domain/placement.ts';
import { useCoursesGraph } from '../../../hooks/courses-graph.hook.tsx';
import { useCourses } from '../../../hooks/courses.hook.tsx';
import { useDisclosure } from '../../../hooks/disclosure.hook.ts';
import { useFlowsheetGrid } from '../../../hooks/flowsheet-grid.hook.tsx';
import { usePlacements } from '../../../hooks/placements.hook.tsx';
import { useTerms } from '../../../hooks/terms.hook.tsx';
import Group from '../../layout/group.tsx';
import { Stack } from '../../layout/stack.tsx';
import { Text } from '../../layout/text.tsx';
import { Button } from '../../ui/Button.tsx';
import { Checkbox } from '../../ui/Checkbox.tsx';
import { Dialog, DialogTrigger } from '../../ui/Dialog.tsx';
import { Menu, MenuItem } from '../../ui/Menu.tsx';
import { Modal } from '../../ui/Modal.tsx';
import { Popover } from '../../ui/Popover.tsx';
import styles from './course-placement.module.css';
import { EditCourseForm } from './edit-course-placement-form.tsx';

type CoursePlacementProps = {
  course: Course;
  placement: Placement;
};

export function CoursePlacement({ course, placement, ...props }: CoursePlacementProps) {
  const {
    toggleFocusPlacement,
    toggleLinkingMode,
    linkingMode,
    focusedPlacement,
    toggleSelectedPlacement,
    toggleSelectPrerequisite,
    isSelectedPlacement,
  } = useFlowsheetGrid();
  const { coursesGraph } = useCoursesGraph();
  const { terms } = useTerms();

  const isSelectable =
    !linkingMode ||
    (focusedPlacement &&
      canSelectPrerequisite({
        source: placement,
        target: focusedPlacement,
        terms,
        coursesGraph,
      }));

  const isFocused = focusedPlacement?.id === placement.id;

  const { pressProps, isPressed } = usePress({
    onPress: (e) => {
      if (e.shiftKey || e.ctrlKey) {
        toggleSelectedPlacement(placement.id);
        return;
      }

      if (linkingMode) {
        if (isFocused) {
          toggleLinkingMode(placement);
        } else if (isSelectable) {
          toggleSelectPrerequisite(course.id);
        }

        return;
      }

      toggleFocusPlacement(placement);
    },
  });
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocusVisible } = useFocusRing(props);

  const classNames = getPlacementClasses({
    relation: classifyRelationship(course.id, placement.course, coursesGraph),
    linkingMode,
    isSelected: isSelectedPlacement(placement.id),
    isSelectable: isSelectable,
  });

  return (
    <div
      {...pressProps}
      {...focusProps}
      {...hoverProps}
      data-hovered={isHovered || undefined}
      data-focused={isFocusVisible || undefined}
      data-pressed={isPressed || undefined}
      role="button"
      tabIndex={0}
      className={clsx(classNames)}
    >
      <Stack fill gap={1}>
        <Stack fill>
          <Group justify="between">
            <Text as="h3" size="xs" tone="dimmed" weight="medium" className={styles.code}>
              {course.code}
            </Text>

            <CoursePlacementMenu course={course} placement={placement} />
          </Group>

          <Text size="xs">{course.name}</Text>
        </Stack>

        <Group justify="between">
          <Button slot="drag" variant="transparent" size="none">
            <GripHorizontal color="gray" size={15} />
          </Button>

          <Checkbox
            onChange={() => toggleSelectedPlacement(placement.id)}
            isSelected={isSelectedPlacement(placement.id)}
          />
        </Group>
      </Stack>
    </div>
  );
}

type CoursePlacementMenuProps = {
  course: Course;
  placement: Placement;
};

function CoursePlacementMenu({ course, placement }: CoursePlacementMenuProps) {
  const { toggleLinkingMode } = useFlowsheetGrid();
  const editModalDisclosure = useDisclosure();
  const { placements, setPlacements } = usePlacements();
  const { courses, setCourses } = useCourses();

  const handleDeletePlacement = () => {
    const deletePlacementResult = deletePlacements({
      courses,
      placements,
      placementIds: [placement.id],
    });

    setPlacements(deletePlacementResult.placements);
    setCourses(deletePlacementResult.courses);
  };

  const handleAddPrerequisites = () => {
    toggleLinkingMode(placement);
  };

  return (
    <>
      <DialogTrigger>
        <Button shape="icon" size="none" variant="transparent">
          <EllipsisVertical color="gray" size={15} />
        </Button>

        <Popover placement="top">
          <Menu>
            <MenuItem onPress={handleAddPrerequisites}>
              <Plus size={14} /> Prerequisite
            </MenuItem>

            <MenuItem>
              <Plus size={14} /> Corequisite
            </MenuItem>

            <MenuItem onPress={editModalDisclosure.open}>
              <Pencil size={14} /> Edit
            </MenuItem>

            <MenuItem onPress={handleDeletePlacement}>
              <Trash color="red" size={14} /> Remove
            </MenuItem>
          </Menu>
        </Popover>
      </DialogTrigger>

      <Modal
        isOpen={editModalDisclosure.isOpen}
        onOpenChange={editModalDisclosure.setIsOpen}
        size="lg"
      >
        <Dialog>
          <EditCourseForm course={course} disclosure={editModalDisclosure} />
        </Dialog>
      </Modal>
    </>
  );
}

function getPlacementClasses({
  relation,
  linkingMode,
  isSelected,
  isSelectable,
}: {
  relation: Relationship | null;
  linkingMode: boolean;
  isSelected: boolean;
  isSelectable: boolean;
}) {
  const classes = [styles.card];

  if (isSelected && !linkingMode) {
    classes.push(styles.selected);
  }

  // in normal mode -> highlight based on relation
  if (!linkingMode && relation) {
    classes.push(styles[relation]);
  }

  // in linking mode
  if (linkingMode) {
    if (relation === 'PREREQ') {
      classes.push(styles.selectedPrerequisite);
    }

    if (!isSelectable) {
      classes.push(styles.disabled);
    }
  }

  return classes;
}

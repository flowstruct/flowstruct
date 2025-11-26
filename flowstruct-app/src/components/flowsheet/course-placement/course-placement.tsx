import clsx from 'clsx';
import { EllipsisVertical, GripHorizontal, Pencil, Plus, Trash } from 'lucide-react';
import { useFocusRing, useHover, usePress } from 'react-aria';
import { type Course } from '../../../domain/course';
import type { Placement } from '../../../domain/flowsheet';
import {
  deletePlacements,
  getPlacementState,
  type PlacementPerms,
  type PlacementState,
} from '../../../domain/placement';
import { useCoursesGraph } from '../../../hooks/courses-graph.hook';
import { useCourses } from '../../../hooks/courses.hook';
import { useDisclosure } from '../../../hooks/disclosure.hook';
import { useFlowsheetGrid } from '../../../hooks/flowsheet-grid.hook';
import { usePlacements } from '../../../hooks/placements.hook';
import { useTerms } from '../../../hooks/terms.hook';
import Group from '../../layout/group';
import { Stack } from '../../layout/stack';
import { Text } from '../../layout/text';
import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { Dialog, DialogTrigger } from '../../ui/Dialog';
import { Menu, MenuItem } from '../../ui/Menu';
import { Modal } from '../../ui/Modal';
import { Popover } from '../../ui/Popover';
import styles from './course-placement.module.css';
import { EditCourseForm } from './edit-course-placement-form';

type CoursePlacementProps = {
  course: Course;
  placement: Placement;
};

export function CoursePlacement({ course, placement }: CoursePlacementProps) {
  const {
    toggleFocusPlacement,
    toggleLinkingMode,
    linkingMode,
    focusedPlacement,
    toggleSelectedPlacement,
    isSelectedPlacement,
    selectedPlacements,
  } = useFlowsheetGrid();

  const { coursesGraph } = useCoursesGraph();
  const { terms } = useTerms();
  const { courses, setCourses } = useCourses();

  const state = getPlacementState({
    placement,
    focusedPlacement,
    selectedPlacements,
    terms,
    graph: coursesGraph,
  });

  const perms = {
    exitLinkingMode: state.isFocused && linkingMode,
    togglePrerequisite: !state.isFocused && linkingMode && state.prerequisiteAllowed,
    toggleSelect: !linkingMode,
    toggleFocus: !linkingMode,
  };

  const classes = getPlacementClasses(state, perms);

  const togglePrerequisite = () => {
    if (!focusedPlacement || !perms.togglePrerequisite) return;

    const updatedCourse = courses[focusedPlacement.item];
    if (!updatedCourse) return;

    if (updatedCourse.prerequisites.includes(course.id)) {
      updatedCourse.prerequisites = updatedCourse.prerequisites.filter((pr) => pr !== course.id);
    } else {
      updatedCourse.prerequisites.push(course.id);
    }

    setCourses({ ...courses });
  };

  const { pressProps, isPressed } = usePress({
    onPress: (e) => {
      if ((e.ctrlKey || e.shiftKey) && perms.toggleSelect) {
        toggleSelectedPlacement(placement.id);
        return;
      }

      if (perms.togglePrerequisite) {
        togglePrerequisite();
        return;
      }

      if (perms.exitLinkingMode) {
        toggleLinkingMode(placement);
        return;
      }

      if (perms.toggleFocus) {
        toggleFocusPlacement(placement);
        return;
      }
    },
  });

  const { hoverProps, isHovered } = useHover({});
  const { focusProps, isFocusVisible } = useFocusRing({});

  return (
    <div
      {...pressProps}
      {...hoverProps}
      {...focusProps}
      tabIndex={0}
      role="button"
      data-hovered={isHovered || undefined}
      data-focused={isFocusVisible || undefined}
      data-pressed={isPressed || undefined}
      className={clsx(classes)}
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
            <GripHorizontal size={15} color="gray" />
          </Button>

          <Checkbox
            onChange={() => toggleSelectedPlacement(placement.id)}
            isSelected={isSelectedPlacement(placement.id)}
          />
        </Group>
        {JSON.stringify(state.prerequisiteAllowed)}
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
    const res = deletePlacements({
      courses,
      placements,
      placementIds: [placement.id],
    });

    setPlacements(res.placements);
    setCourses(res.courses);
  };

  return (
    <>
      <DialogTrigger>
        <Button shape="icon" size="none" variant="transparent">
          <EllipsisVertical size={15} color="gray" />
        </Button>

        <Popover placement="top">
          <Menu>
            <MenuItem onPress={() => toggleLinkingMode(placement)}>
              <Plus size={14} /> Prerequisite
            </MenuItem>

            <MenuItem>
              <Plus size={14} /> Corequisite
            </MenuItem>

            <MenuItem onPress={editModalDisclosure.open}>
              <Pencil size={14} /> Edit
            </MenuItem>

            <MenuItem onPress={handleDeletePlacement}>
              <Trash size={14} color="red" /> Remove
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

function getPlacementClasses(state: PlacementState, perms: PlacementPerms) {
  const classes = [styles.card];

  if (perms.exitLinkingMode) {
    classes.push(styles.focused);
  }

  if (perms.togglePrerequisite && state.relation === 'PREREQ') {
    classes.push(styles.selectedPrerequisite);
  }

  if (perms.toggleSelect && state.isSelected) {
    classes.push(styles.selected);
  }

  if (perms.toggleFocus && state.isFocused) {
    classes.push(styles.focused);
  }

  return classes;
}

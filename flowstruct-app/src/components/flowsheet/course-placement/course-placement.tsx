import { EllipsisVertical, GripHorizontal, Pencil, Plus, Trash } from 'lucide-react';
import { useFocusRing, useHover, usePress } from 'react-aria';
import { type Course } from '../../../domain/course';
import type { Placement } from '../../../domain/flowsheet';
import {
  deletePlacements
} from '../../../domain/placement';
import { useCourses } from '../../../hooks/courses.hook';
import { useDisclosure } from '../../../hooks/disclosure.hook';
import { useFlowsheetGrid } from '../../../hooks/flowsheet-grid.hook';
import { usePlacement } from '../../../hooks/placement.hook';
import { usePlacements } from '../../../hooks/placements.hook';
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
  const { state, dispatch } = useFlowsheetGrid();
  const placementState = usePlacement(placement);

  const { courses, setCourses } = useCourses();
  const { placements } = usePlacements();

  const togglePrerequisite = () => {
    if (!state.linkSource) return;

    const sourcePlacement = placements[state.linkSource];
    const updatedCourse = courses[sourcePlacement.item];

    if (!updatedCourse) return;

    if (updatedCourse.prerequisites.includes(course.id)) {
      updatedCourse.prerequisites = updatedCourse.prerequisites.filter((pr) => pr !== course.id);
    } else {
      updatedCourse.prerequisites.push(course.id);
    }

    setCourses({ ...courses });
  };

  const toggleCorequisite = () => {
    if (!state.linkSource) return;

    const sourcePlacement = placements[state.linkSource];
    const updatedCourse = courses[sourcePlacement.item];

    if (!updatedCourse) return;

    if (updatedCourse.corequisites.includes(course.id)) {
      updatedCourse.corequisites = updatedCourse.corequisites.filter((pr) => pr !== course.id);
    } else {
      updatedCourse.corequisites.push(course.id);
    }

    setCourses({ ...courses });
  }

  const { pressProps, isPressed } = usePress({
    onPress: (e) => {
      if ((e.ctrlKey || e.shiftKey) && placementState === 'NORMAL') {
        dispatch({ type: 'TOGGLE_SELECT', payload: { placementId: placement.id } });
        return;
      }

      if (placementState === 'SELECTABLE' || placementState === 'SELECTED') {
        dispatch({ type: 'TOGGLE_SELECT', payload: { placementId: placement.id } });
      }

      if (placementState === 'PREREQ_LINK' || placementState === 'AVAILABLE_LINK' && state.linkType === 'PREREQ') {
        togglePrerequisite();
        return;
      }

      if (placementState === 'COREQ_LINK' || placementState === 'AVAILABLE_LINK' && state.linkType === 'COREQ') {
        toggleCorequisite();
        return;
      }

      if (placementState === 'LINK_SOURCE') {
        dispatch({ type: 'TOGGLE_LINKING', payload: { placementId: placement.id, type: null } });
        return;
      }

      if (state.focused || placementState === 'NORMAL') {
        dispatch({ type: 'TOGGLE_FOCUS', payload: { placementId: placement.id } });
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
      data-state={placementState}
      className={styles.card}
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
            onChange={() => dispatch({ type: 'TOGGLE_SELECT', payload: { placementId: placement.id } })}
            isSelected={state.selected.has(placement.id)}
          />
        </Group>
        {JSON.stringify(placementState)}
      </Stack>
    </div>
  );
}

type CoursePlacementMenuProps = {
  course: Course;
  placement: Placement;
};

function CoursePlacementMenu({ course, placement }: CoursePlacementMenuProps) {
  const { dispatch } = useFlowsheetGrid();

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
            <MenuItem aria-label="Add prerequiste" onPress={() => dispatch({ type: 'TOGGLE_LINKING', payload: { placementId: placement.id, type: 'PREREQ' } })}>
              <Plus size={14} /> Prerequisite
            </MenuItem>

            <MenuItem aria-label="Add corequisite" onPress={() => dispatch({ type: 'TOGGLE_LINKING', payload: { placementId: placement.id, type: 'COREQ' } })}>
              <Plus size={14} /> Corequisite
            </MenuItem>

            <MenuItem aria-label="Edit details" onPress={editModalDisclosure.open}>
              <Pencil size={14} /> Edit
            </MenuItem>

            <MenuItem aria-label="Remove placement" onPress={handleDeletePlacement}>
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

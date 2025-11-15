import clsx from 'clsx';
import { EllipsisVertical, GripHorizontal, Pencil, Plus, Trash } from 'lucide-react';
import { useFocusRing, useHover, usePress } from 'react-aria';
import { type Course } from '../../domain/course.ts';
import type { Placement } from '../../domain/flowsheet.ts';
import { useDisclosure, type DisclosureReturnResult } from '../../hooks/disclosure.hook.ts';
import { useFlowsheetGrid } from '../../hooks/flowsheet-grid.hook.tsx';
import { useForm } from '../../hooks/form.hook.ts';
import { handleSubmit } from '../../utils/handle-submit.ts';
import Group from '../layout/group.tsx';
import { Stack } from '../layout/stack.tsx';
import { Text } from '../layout/text.tsx';
import { Button } from '../ui/Button.tsx';
import { Checkbox } from '../ui/Checkbox.tsx';
import { Dialog, DialogTrigger } from '../ui/Dialog.tsx';
import { Menu, MenuItem } from '../ui/Menu.tsx';
import { Modal } from '../ui/Modal.tsx';
import { Popover } from '../ui/Popover.tsx';
import styles from './course-placement.module.css';

type CourseCardProps = {
  course: Course;
  placement: Placement;
};

export function CoursePlacement({ course, placement, ...props }: CourseCardProps) {
  const { toggleSelectedPlacement, isSelectedPlacement } = useFlowsheetGrid();

  const { pressProps, isPressed } = usePress({
    onPress: (e) => {
      if (e.shiftKey || e.ctrlKey) {
        toggleSelectedPlacement(placement.id);
      }
    },
  });
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocusVisible } = useFocusRing(props);

  return (
    <>
      <div>
        <div
          className={clsx(styles.card, isSelectedPlacement(placement.id) && styles.selected)}
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

                <CoursePlacementMenu placement={placement} course={course} />
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
      </div>
    </>
  );
}

type CoursePlacementMenuProps = {
  placement: Placement;
  course: Course;
};

function CoursePlacementMenu({ placement, course }: CoursePlacementMenuProps) {
  const { toggleFocusPlacement } = useFlowsheetGrid();

  const editModalDisclosure = useDisclosure();

  return (
    <>
      <DialogTrigger>
        <Button
          shape="icon"
          size="none"
          variant="transparent"
          onPress={() => toggleFocusPlacement(placement.id)}
        >
          <EllipsisVertical color="gray" size={15} />
        </Button>

        <Popover isNonModal placement="top">
          <Menu>
            <MenuItem>
              <Plus size={14} /> Prerequisite
            </MenuItem>

            <MenuItem>
              <Plus size={14} /> Corequisite
            </MenuItem>

            <MenuItem onPress={editModalDisclosure.open}>
              <Pencil size={14} /> Edit
            </MenuItem>

            <MenuItem>
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

type EditCourseFormProps = {
  course: Course;
  disclosure: DisclosureReturnResult;
};

function EditCourseForm({ course, disclosure }: EditCourseFormProps) {
  const form = useForm(course);

  const onSubmit = handleSubmit<Course>(() => {
    const updatedCourse: Course = {
      ...form.data,
      code: form.data.code.toUpperCase(),
    };

    form.reset();
    disclosure.close();
  });

  return <div>yes</div>;
}

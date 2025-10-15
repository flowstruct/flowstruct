import { CourseSummary } from '@/features/course/domain/course.ts';
import styles from './course-card.module.css';
import { useFlowsheetGridContext } from '@/features/flowsheet/contexts/flowsheet-grid-context.tsx';
import { UnstyledButton } from '@/shared/components/ui/UnstyledButton.tsx';
import { Checkbox } from '@/shared/components/ui/Checkbox.tsx';
import { Menu, MenuItem, MenuTrigger } from '@/shared/components/ui/Menu.tsx';
import { Button } from '@/shared/components/ui/Button.tsx';
import { EllipsisVertical, TagIcon, X } from 'lucide-react';
import { Popover } from '@/shared/components/ui/Popover.tsx';
import { useMutation } from '@tanstack/react-query';
import { flowsheetApi } from '@/features/flowsheet/api.ts';
import { useFlowsheetContext } from '@/features/flowsheet/contexts/flowsheet-context.tsx';
import Group from '@/shared/components/layout/group.tsx';
import { Stack } from '@/shared/components/layout/stack.tsx';

type CourseCardProps = {
  course: CourseSummary;
  mode?: 'pending' | 'base';
};

export function CourseCard({ course, mode = 'base' }: CourseCardProps) {
  const { toggleSelectCourse, isSelected } = useFlowsheetGridContext();

  return (
    <UnstyledButton
      className={styles.button}
      data-mode={mode}
      onPress={() => toggleSelectCourse(course.id)}
    >
      <div data-selected={isSelected(course.id) ? true : undefined} className={styles.card}>
        <Stack fill justify="between">
          <Stack gap={1}>
            <Group justify="between">
              <Group>
                {isSelected(course.id) && <Checkbox isSelected />}

                <h3 className={styles.code}>{course.code}</h3>
              </Group>

              <ActionsMenu course={course} />
            </Group>

            <p className={styles.name}>{course.name}</p>
          </Stack>

          {/*<Group justify="end">*/}
          {/*  <Button size="xs" shape="icon" variant="ghost">*/}
          {/*    <Link size={12} />*/}
          {/*  </Button>*/}
          {/*</Group>*/}
        </Stack>
      </div>
    </UnstyledButton>
  );
}

type ActionsMenuProps = {
  course: CourseSummary;
};

function ActionsMenu({ course }: ActionsMenuProps) {
  const { flowsheet } = useFlowsheetContext();

  const removeCourse = useMutation({
    mutationFn: () =>
      flowsheetApi.removeCourses({ flowsheetId: flowsheet.id, courseIds: [course.id] }),
  });

  return (
    <MenuTrigger>
      <Button variant="ghost" size="xs" shape="icon">
        <EllipsisVertical size={12} />
      </Button>

      <Popover placement="bottom right" crossOffset={24}>
        <Menu>
          <MenuItem>
            <TagIcon size={14} /> Assign section
          </MenuItem>

          <MenuItem onPress={() => removeCourse.mutate()}>
            <X color="red" size={14} /> Remove
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

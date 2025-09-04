import { ActionIcon, Menu } from '@mantine/core';
import { CourseSummary } from '@/features/course/types.ts';
import { EllipsisVertical } from 'lucide-react';
import { CourseDangerousOptionsMenuItems } from '@/features/course/components/CourseDangerousOptionsMenuItems.tsx';

type Props = {
  course: CourseSummary;
  onDeleteSuccess?: () => void;
};

export function CourseOptionsMenu({ course }: Props) {
  return (
    <Menu
      width={200}
      shadow="sm"
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      keepMounted
    >
      <Menu.Target>
        <ActionIcon variant="transparent" color="gray">
          <EllipsisVertical size={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>

        <CourseDangerousOptionsMenuItems course={course} />
      </Menu.Dropdown>
    </Menu>
  );
}

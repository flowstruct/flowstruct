import { ActionIcon, Menu } from '@mantine/core';
import { CourseSummary } from '@/features/course/types.ts';
import { Ellipsis, Pencil, ScrollText } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { CourseDangerousOptionsMenuItems } from '@/features/course/components/CourseDangerousOptionsMenuItems.tsx';

type Props = {
  course: CourseSummary;
};

export function CourseTableOptionsMenu({ course }: Props) {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="transparent">
          <Ellipsis color="gray" size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>

        <Link
          style={{ textDecoration: 'none' }}
          to="/catalog/courses/$courseId"
          params={{ courseId: String(course.id) }}
        >
          <Menu.Item leftSection={<ScrollText size={14} />}>View</Menu.Item>
        </Link>

        <Link
          style={{ textDecoration: 'none' }}
          to="/catalog/courses/$courseId/edit"
          params={{ courseId: String(course.id) }}
        >
          <Menu.Item leftSection={<Pencil size={14} />}>Edit details</Menu.Item>
        </Link>

        <CourseDangerousOptionsMenuItems course={course} />
      </Menu.Dropdown>
    </Menu>
  );
}

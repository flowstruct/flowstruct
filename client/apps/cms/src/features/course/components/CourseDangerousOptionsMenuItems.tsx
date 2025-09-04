import { Menu, Text } from '@mantine/core';
import { CourseSummary } from '@/features/course/types.ts';
import { History, RotateCcw } from 'lucide-react';
import { useMarkCourseOutdated } from '@/features/course/hooks/useMarkCourseOutdated.ts';
import { useMarkCourseActive } from '@/features/course/hooks/useMarkCourseActive.ts';
import { modals } from '@mantine/modals';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';
import { usePermission } from '@/features/user/hooks/usePermission.ts';

type Props = {
  course: CourseSummary;
};

export function CourseDangerousOptionsMenuItems({ course }: Props) {
  const { mutate: markOutdated } = useMarkCourseOutdated();
  const { mutate: markActive } = useMarkCourseActive();

  const { hasPermission } = usePermission();

  const handleMarkOutdated = () => {
    modals.openConfirmModal({
      title: <ModalHeader title="Please Confirm Your Action" />,
      children: (
        <Text size="sm">
          Marking this course as outdated will indicate it's no longer in use. Are you sure you want
          to proceed?
        </Text>
      ),
      labels: { confirm: 'Mark Outdated', cancel: 'Cancel' },
      onConfirm: () => markOutdated(course.id),
    });
  };

  const handleMarkActive = () => {
    modals.openConfirmModal({
      title: <ModalHeader title="Please Confirm Your Action" />,
      children: (
        <Text size="sm">
          Marking this course as active will indicate it's currently in use. Are you sure you want
          to proceed?
        </Text>
      ),
      labels: { confirm: 'Mark Active', cancel: 'Cancel' },
      onConfirm: () => markActive(course.id),
    });
  };

  return (
    <>
      {hasPermission('courses:mark-outdated') && (
        <>
          <Menu.Divider />

          {course.outdatedAt ? (
            <Menu.Item
              color="green"
              leftSection={<RotateCcw size={14} />}
              onClick={handleMarkActive}
            >
              Mark as Active
            </Menu.Item>
          ) : (
            <Menu.Item
              color="orange"
              leftSection={<History size={14} />}
              onClick={handleMarkOutdated}
            >
              Mark as Outdated
            </Menu.Item>
          )}
        </>
      )}
    </>
  );
}

import { ActionIcon, Button, Group, LoadingOverlay, Menu, Stack, Text } from '@mantine/core';
import { ArrowLeftRight, Ellipsis, Pencil, ScrollText, X } from 'lucide-react';
import { modals } from '@mantine/modals';
import { CourseDisplay } from '@/features/course/components/CourseDisplay.tsx';
import { SectionsMenuItems } from '@/features/study-plan/components/SectionsMenuItems.tsx';
import { FrameworkCourse } from '@/features/study-plan/types.ts';
import { useRemoveCoursesFromStudyPlan } from '@/features/study-plan/hooks/useRemoveCourseFromSection.ts';
import { useParams } from '@tanstack/react-router';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';
import { EditCourseForm } from '@/features/course/components/EditCourseForm.tsx';
import { Suspense } from 'react';

type Props = {
  course: FrameworkCourse;
  sectionId: number;
};

export function StudyPlanCourseOptionsMenu({ course, sectionId }: Props) {
  const { studyPlanId } = useParams({ from: '/_layout/study-plans/$studyPlanId' });
  const removeCourse = useRemoveCoursesFromStudyPlan();

  const openEditCourseModal = () =>
    modals.open({
      title: (
        <ModalHeader
          title={`${course.code}: ${course.name}`}
          subtitle="Update the details for this course"
        />
      ),
      children: (
        <Suspense
          fallback={<LoadingOverlay visible zIndex={1000} loaderProps={{ type: 'bars' }} />}
        >
          <EditCourseForm courseId={course.id} />
        </Suspense>
      ),
      size: 'xl',
      centered: true,
    });

  const removeCourseConfirmModal = () =>
    modals.openConfirmModal({
      title: <ModalHeader title="Please Confirm Your Action" />,
      children: (
        <Text size="sm">
          Removing these courses will remove them from the program map and any prerequisite
          relationships. Are you sure you want to proceed?
        </Text>
      ),
      labels: { confirm: 'Remove Courses', cancel: 'Cancel' },
      onConfirm: () => {
        removeCourse.mutate({
          courseIds: [course.id],
          studyPlanId: Number(studyPlanId),
        });

        modals.closeAll();
      },
    });

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon loading={removeCourse.isPending} color="gray" variant="transparent">
          <Ellipsis size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{course.code} Actions</Menu.Label>

        <Menu.Item
          leftSection={<ScrollText size={14} />}
          onClick={() =>
            modals.open({
              title: (
                <ModalHeader
                  title={`${course.code}: ${course.name}`}
                  subtitle="Details about this course"
                />
              ),
              children: (
                <Stack>
                  <CourseDisplay courseId={course.id} />
                  <Group justify="space-between">
                    <Button
                      color="red"
                      leftSection={<X size={18} />}
                      onClick={removeCourseConfirmModal}
                    >
                      Remove
                    </Button>

                    <Button
                      onClick={openEditCourseModal}
                      variant="outline"
                      leftSection={<Pencil size={16} />}
                    >
                      Edit Details
                    </Button>
                  </Group>
                </Stack>
              ),
              centered: true,
              size: 'lg',
            })
          }
        >
          View
        </Menu.Item>

        <Menu.Item leftSection={<Pencil size={14} />} onClick={openEditCourseModal}>
          Edit Details
        </Menu.Item>

        <Menu.Sub>
          <Menu.Sub.Target>
            <Menu.Sub.Item leftSection={<ArrowLeftRight size={14} />}>Change section</Menu.Sub.Item>
          </Menu.Sub.Target>

          <Menu.Sub.Dropdown>
            <SectionsMenuItems courseId={course.id} sectionId={sectionId} />
          </Menu.Sub.Dropdown>
        </Menu.Sub>

        <Menu.Divider />

        <Menu.Item color="red" leftSection={<X size={14} />} onClick={removeCourseConfirmModal}>
          Remove
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

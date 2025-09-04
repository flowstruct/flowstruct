import { ActionIcon, Box, Group, Menu, Slider, Tooltip } from '@mantine/core';
import { BookOpen, EllipsisVertical, Scaling, X } from 'lucide-react';
import { Link, useParams } from '@tanstack/react-router';
import { DefaultFrameworkCoursesSearchValues } from '@/utils/defaultFrameworkCoursesSearchValues.ts';
import { CourseSummary } from '@/features/course/types.ts';
import { useRemoveCoursePlacement } from '@/features/study-plan/hooks/useRemoveCoursePlacement.ts';
import { CoursePlacement, StudyPlan } from '@/features/study-plan/types.ts';
import { useResizeCoursePlacement } from '@/features/study-plan/hooks/useResizeCoursePlacement.ts';
import { useQueryClient } from '@tanstack/react-query';
import { studyPlanKeys } from '@/features/study-plan/queries.ts';

type Props = {
  course: CourseSummary;
  placement: CoursePlacement;
};

export function ProgramMapCourseOptions({ course, placement }: Props) {
  const { studyPlanId } = useParams({ from: '/_layout/study-plans/$studyPlanId' });
  const queryClient = useQueryClient();
  const removeCoursePlacement = useRemoveCoursePlacement();
  const resizeCoursePlacement = useResizeCoursePlacement();

  const handleChangeSpan = (newSpan: number) => {
    queryClient.setQueryData(studyPlanKeys.detail(Number(studyPlanId)), (oldData?: StudyPlan) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        coursePlacements: {
          ...oldData.coursePlacements,
          [course.id]: {
            ...oldData.coursePlacements[course.id],
            span: newSpan,
          },
        },
      };
    });
  };

  const handleRemoveCoursePlacement = () =>
    removeCoursePlacement.mutate({
      studyPlanId: Number(studyPlanId),
      courseId: course.id,
    });

  const handleResizeCoursePlacement = (span: number) =>
    resizeCoursePlacement.mutate({
      studyPlanId: Number(studyPlanId),
      courseId: course.id,
      span,
    });

  const marks = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon
          color="gray"
          variant="transparent"
          loading={removeCoursePlacement.isPending || resizeCoursePlacement.isPending}
        >
          <EllipsisVertical size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>

        <Link
          style={{ textDecoration: 'none' }}
          to="/study-plans/$studyPlanId/courses"
          params={{ studyPlanId: String(studyPlanId) }}
          search={{
            ...DefaultFrameworkCoursesSearchValues(),
            filter: course.code,
          }}
        >
          <Menu.Item leftSection={<BookOpen size={14} />}>View in courses</Menu.Item>
        </Link>

        <Box px="sm" py="xs">
          <Group gap="xs" align="center">
            <Tooltip label="Resize vertically">
              <Scaling size={14} />
            </Tooltip>

            <Slider
              restrictToMarks
              defaultValue={placement.span}
              step={1}
              min={1}
              max={5}
              marks={marks}
              styles={{ markLabel: { display: 'none' }, root: { flex: 1 } }}
              onChange={handleChangeSpan}
              onChangeEnd={handleResizeCoursePlacement}
            />
          </Group>
        </Box>

        <Menu.Divider />

        <Menu.Item color="red" leftSection={<X size={14} />} onClick={handleRemoveCoursePlacement}>
          Remove
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

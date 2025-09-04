import { Group, LoadingOverlay, Stack } from '@mantine/core';
import { InfoItem } from '@/shared/components/InfoItem.tsx';
import { CourseType } from '@/features/course/types.ts';
import { useCourse } from '@/features/course/hooks/useCourse.ts';
import classes from '@/shared/styles/DetailsContainer.module.css';

type Props = {
  courseId: number;
};

export function CourseDisplay({ courseId }: Props) {
  const { data: course, isLoading } = useCourse(courseId);

  if (isLoading)
    return <LoadingOverlay visible={isLoading} zIndex={1000} loaderProps={{ type: 'bars' }} />;

  if (!course) return;

  return (
    <div className={classes.detailsContainer}>
      <Stack>
        <Group grow>
          <InfoItem label="Code" value={course.code} />
          <InfoItem label="Name" value={course.name} />
        </Group>

        <Group grow>
          <InfoItem label="Credit Hours" value={course.creditHours} suffix="Cr." />
          <InfoItem label="ECTS" value={course.ects} suffix="ECTS" />
        </Group>

        <Group grow>
          <InfoItem label="Lecture Hours" value={course.lectureHours} suffix="Hrs/Week" />
          <InfoItem label="Practical Hours" value={course.practicalHours} suffix="Hrs/Week" />
        </Group>

        <Group grow>
          <InfoItem
            label="Type"
            value={CourseType[course.type as keyof typeof CourseType]}
            suffix={`(${course.type})`}
          />
          <InfoItem label="Is Remedial" value={course.isRemedial ? 'Yes' : 'No'} />
        </Group>
      </Stack>
    </div>
  );
}

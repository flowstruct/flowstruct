import {
  Button,
  Flex,
  FocusTrap,
  Group,
  MultiSelect,
  MultiSelectProps,
  Popover,
  SegmentedControl,
  Text,
} from '@mantine/core';
import React from 'react';
import { CircleAlert, Link, Plus } from 'lucide-react';
import { useCoursesGraph } from '@/contexts/CoursesGraphContext.tsx';
import { useLinkPrerequisitesToCourse } from '@/features/study-plan/hooks/useLinkPrerequisitesToCourse.ts';
import { CourseRelation, StudyPlan } from '@/features/study-plan/types.ts';
import { useLinkCorequisitesToCourse } from '@/features/study-plan/hooks/useLinkCorequisitesToCourse.ts';
import classes from '@/features/study-plan/styles/CoursesMultiSelect.module.css';
import { getSectionCode } from '@/utils/getSectionCode.ts';
import { CourseSummary } from '@/features/course/types.ts';
import { EntityNameWithStatus } from '@/shared/components/EntityNameWithStatus.tsx';

type CourseOption = {
  value: string;
  label: string;
  disabled: boolean;
  createsCycle: boolean;
};

type PrerequisiteMultiSelectProps = {
  courses: Record<number, CourseSummary>;
  parentCourseId: number;
  studyPlan: StudyPlan;
};

export function PrerequisiteMultiSelect({
  parentCourseId,
  courses,
  studyPlan,
}: PrerequisiteMultiSelectProps) {
  const [opened, setOpened] = React.useState(false);
  const [selectedCourses, setSelectedCourses] = React.useState<string[]>([]);
  const [requisiteType, setRequisiteType] = React.useState<'PRE' | 'CO'>('PRE');

  const { coursesGraph } = useCoursesGraph();

  const linkPrerequisitesToCourse = useLinkPrerequisitesToCourse();
  const linkCorequisitesToCourse = useLinkCorequisitesToCourse();

  const handleAssignCourses = () => {
    if (requisiteType === 'PRE') {
      linkPrerequisitesToCourse.mutate(
        {
          courseId: parentCourseId,
          studyPlanId: studyPlan.id,
          prerequisites: selectedCourses.map(Number),
          relation: CourseRelation.AND,
        },
        {
          onSuccess: () => {
            setOpened(false);
            setSelectedCourses([]);
          },
        }
      );
      return;
    }

    linkCorequisitesToCourse.mutate(
      {
        courseId: parentCourseId,
        studyPlanId: studyPlan.id,
        corequisiteIds: selectedCourses.map(Number),
      },
      {
        onSuccess: () => {
          setOpened(false);
          setSelectedCourses([]);
          setRequisiteType('PRE');
        },
      }
    );
  };

  const data = React.useMemo(() => {
    return studyPlan.sections.map((section) => {
      const sectionCode = getSectionCode(section);
      const displayName = section.name
        ? `- ${section.name}`
        : sectionCode.split('.').length > 2
          ? '- General'
          : '';

      return {
        group: `${sectionCode}: ${section.level} ${section.type} ${displayName}`,
        items: section.courses
          .map((id) => {
            const course = courses[id];
            if (!course) return null;

            const prerequisites = studyPlan.coursePrerequisites[parentCourseId] ?? {};

            if (prerequisites[id] !== undefined) return null;
            if (parentCourseId === id) return null;

            const createsCycle = coursesGraph.get(parentCourseId)?.postrequisiteSequence.has(id);

            return {
              value: id.toString(),
              label: `${course.code}: ${course.name}`,
              disabled: createsCycle,
              createsCycle: createsCycle,
            } as CourseOption;
          })
          .filter((option): option is CourseOption => option !== null),
      };
    });
  }, [courses, coursesGraph, parentCourseId, studyPlan.coursePrerequisites, studyPlan.sections]);

  const renderOption: MultiSelectProps['renderOption'] = ({ option }) => {
    const courseOption = option as unknown as CourseOption;
    const course = courses[Number(option.value)];

    return (
      <div>
        <EntityNameWithStatus
          className={classes.label}
          label={courseOption.label}
          entity={course}
          entityType="course"
        />

        {courseOption.createsCycle && (
          <Text className={classes.warning}>
            <Group gap={6}>
              <CircleAlert size={14} />
              Creates cycle
            </Group>
          </Text>
        )}
      </div>
    );
  };

  const canAddRequisites = selectedCourses.length > 0;

  return (
    <Popover
      position="left-start"
      shadow="md"
      width={360}
      opened={opened}
      onChange={setOpened}
      withArrow
    >
      <Popover.Target>
        <Button
          onClick={() => setOpened((o) => !o)}
          radius="xl"
          variant="subtle"
          size="compact-xs"
          leftSection={<Plus size={14} />}
        >
          Add
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Flex direction="column" gap="sm">
          <Group grow preventGrowOverflow={false} gap="xs" wrap="nowrap">
            <SegmentedControl
              value={requisiteType}
              onChange={(val) => setRequisiteType(val as 'PRE' | 'CO')}
              size="xs"
              data={[
                { label: 'PRE', value: 'PRE' },
                { label: 'CO', value: 'CO' },
              ]}
            />

            <Button
              disabled={!canAddRequisites}
              leftSection={<Link size={14} />}
              loading={linkPrerequisitesToCourse.isPending || linkCorequisitesToCourse.isPending}
              onClick={handleAssignCourses}
            >
              Assign {requisiteType === 'PRE' ? 'Prerequisites' : 'Corequisites'}
            </Button>
          </Group>

          <FocusTrap active={opened}>
            <MultiSelect
              comboboxProps={{
                withinPortal: false,
                classNames: {
                  option: classes.option,
                },
              }}
              nothingFoundMessage="No results"
              renderOption={renderOption}
              data={data}
              value={selectedCourses}
              onChange={setSelectedCourses}
              label={`Assign ${requisiteType === 'PRE' ? 'prerequisites' : 'corequisites'} to ${courses[parentCourseId]?.code}`}
              placeholder="Search framework courses"
              selectFirstOptionOnChange
              searchable
              hidePickedOptions
            />
          </FocusTrap>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
}

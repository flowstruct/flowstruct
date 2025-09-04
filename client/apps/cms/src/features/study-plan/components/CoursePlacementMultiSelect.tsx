import { Button, Group, MultiSelect, MultiSelectProps, Popover, Stack, Text } from '@mantine/core';
import { BetweenHorizontalStart, CircleAlert, Plus } from 'lucide-react';
import React from 'react';
import { usePlaceCoursesInSemester } from '@/features/study-plan/hooks/useAddCoursesToSemester.ts';
import classes from '../styles/CoursesMultiSelect.module.css';
import { getSectionCode } from '@/utils/getSectionCode.ts';
import { CoursePlacement } from '@/features/study-plan/types.ts';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import { useCurrentStudyPlanCourses } from '@/features/study-plan/hooks/useCurrentStudyPlanCourses.ts';
import { comparePlacement } from '@/utils/comparePlacement.ts';
import { EntityNameWithStatus } from '@/shared/components/EntityNameWithStatus.tsx';

type CoursePlacementMultiSelectProps = {
  placement: CoursePlacement;
};

interface CourseOption {
  label: string;
  value: string;
  disabled: boolean;
  alreadyAdded: boolean;
  unmetPrerequisites: string[];
}

export function CoursePlacementMultiSelect({ placement }: CoursePlacementMultiSelectProps) {
  const [opened, setOpened] = React.useState(false);
  const [selectedCourses, setSelectedCourses] = React.useState<string[]>([]);
  const { data: studyPlan } = useCurrentStudyPlan();
  const { data: courses } = useCurrentStudyPlanCourses();

  const SEMESTER_NAMES = ['first', 'second', 'summer'];

  const placeCourses = usePlaceCoursesInSemester();

  const handlePlaceCourses = () =>
    placeCourses.mutate(
      {
        studyPlanId: studyPlan.id,
        targetPlacement: { ...placement, position: placement.position + 1 },
        courseIds: selectedCourses.map((id) => Number(id)),
      },
      {
        onSuccess: () => {
          setSelectedCourses([]);
          setOpened(false);
        },
      }
    );

  if (!placement) return null;

  const data = studyPlan.sections.map((section) => {
    const sectionCode = getSectionCode(section);
    const displayName = section.name
      ? `- ${section.name}`
      : sectionCode.split('.').length > 2
        ? '- General'
        : '';

    return {
      group: `${sectionCode}. ${section.level} ${section.type} ${displayName}`,
      items: section.courses
        .map((courseId) => {
          const course = courses[courseId];
          if (!course) return null;

          const prerequisites = studyPlan.coursePrerequisites[courseId] ?? {};
          const unmetPrerequisites = Object.keys(prerequisites).filter((prerequisiteId) => {
            const prerequisitePlacement = studyPlan.coursePlacements[Number(prerequisiteId)];
            return (
              prerequisitePlacement === undefined ||
              comparePlacement(prerequisitePlacement, placement) >= 0
            );
          });

          if (studyPlan.coursePlacements[courseId] !== undefined) return null;

          return {
            label: `${course.code}: ${course.name}`,
            value: courseId.toString(),
            disabled: unmetPrerequisites.length > 0,
            unmetPrerequisites,
          } as CourseOption;
        })
        .filter((item): item is CourseOption => item !== null),
    };
  });

  const renderOption: MultiSelectProps['renderOption'] = ({ option }) => {
    const courseOption = option as unknown as CourseOption;
    const course = courses[Number(option.value)];

    return (
      <div>
        <EntityNameWithStatus
          className={classes.label}
          entity={course}
          label={courseOption.label}
          entityType="course"
        />

        {courseOption.unmetPrerequisites.length > 0 && (
          <Text className={classes.warning}>
            <Group gap={6}>
              <CircleAlert size={14} />
              Prerequisites:{' '}
              {courseOption.unmetPrerequisites
                .map((prerequisiteId) => {
                  const prerequisite = courses[Number(prerequisiteId)];
                  return prerequisite?.code || prerequisiteId;
                })
                .join(', ')}
            </Group>
          </Text>
        )}
      </div>
    );
  };

  return (
    <Popover trapFocus opened={opened} onChange={setOpened} withArrow shadow="md" width={360}>
      <Popover.Target>
        <Button
          fullWidth
          variant="transparent"
          size="compact-xs"
          onClick={() => setOpened((o) => !o)}
          leftSection={<Plus size={14} />}
        >
          Add
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
          <Button
            disabled={selectedCourses.length === 0}
            loading={placeCourses.isPending}
            leftSection={<BetweenHorizontalStart size={18} />}
            onClick={handlePlaceCourses}
          >
            Place Courses
          </Button>

          <MultiSelect
            comboboxProps={{
              withinPortal: false,
              classNames: {
                option: classes.option,
              },
            }}
            nothingFoundMessage="No results"
            withCheckIcon
            renderOption={renderOption}
            data={data}
            value={selectedCourses}
            onChange={setSelectedCourses}
            selectFirstOptionOnChange
            label={`Add courses to year ${placement.year}, ${SEMESTER_NAMES[placement.semester - 1]} semester`}
            placeholder="Search study plan courses..."
            searchable
            hidePickedOptions
          />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

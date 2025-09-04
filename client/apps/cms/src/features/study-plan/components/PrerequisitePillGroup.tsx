import { Flex, Indicator, Loader, Pill } from '@mantine/core';
import { PrerequisiteMultiSelect } from '@/features/study-plan/components/PrerequisiteMultiSelect.tsx';
import { useUnlinkPrerequisiteFromCourse } from '@/features/study-plan/hooks/useUnlinkPrerequisiteFromCourse.ts';
import { useUnlinkCorequisiteFromCourse } from '@/features/study-plan/hooks/useUnlinkCorequisiteFromCourse.ts';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import { useCurrentStudyPlanCourses } from '@/features/study-plan/hooks/useCurrentStudyPlanCourses.ts';

type PrerequisitePillGroupProps = {
  parentCourseId: number;
};

export function PrerequisitePillGroup({ parentCourseId }: PrerequisitePillGroupProps) {
  const unlinkPrerequisiteFromCourse = useUnlinkPrerequisiteFromCourse();
  const unlinkCorequisiteFromCourse = useUnlinkCorequisiteFromCourse();

  const { data: studyPlan } = useCurrentStudyPlan();
  const { data: courses } = useCurrentStudyPlanCourses();

  const handleRemovePrerequisite = (prerequisiteId: number) =>
    unlinkPrerequisiteFromCourse.mutate({
      studyPlanId: studyPlan.id,
      courseId: parentCourseId,
      prerequisiteId: prerequisiteId,
    });

  const handleRemoveCorequisite = (corequisiteId: number) =>
    unlinkCorequisiteFromCourse.mutate({
      studyPlanId: studyPlan.id,
      courseId: parentCourseId,
      corequisiteId: corequisiteId,
    });

  const prerequisites = studyPlan.coursePrerequisites[parentCourseId] ?? {};
  const corequisites = studyPlan.courseCorequisites[parentCourseId] ?? [];

  return (
    <Flex align="center" w={200} wrap="wrap" gap={7}>
      {Object.keys(prerequisites).map((prerequisiteId) => {
        const prerequisite = courses[Number(prerequisiteId)];
        if (!prerequisite) return null;

        const isRemovingPrerequisite =
          unlinkPrerequisiteFromCourse.isPending &&
          unlinkPrerequisiteFromCourse.variables.prerequisiteId === prerequisite.id &&
          unlinkPrerequisiteFromCourse.variables.courseId === parentCourseId;

        return (
          <Pill
            key={prerequisite.id}
            withRemoveButton
            disabled={isRemovingPrerequisite}
            onRemove={() => handleRemovePrerequisite(prerequisite.id)}
          >
            {prerequisite.code}
          </Pill>
        );
      })}

      {corequisites.map((corequisiteId) => {
        const corequisite = courses[corequisiteId];
        if (!corequisite) return null;

        const isRemovingCorequisite =
          unlinkCorequisiteFromCourse.isPending &&
          unlinkCorequisiteFromCourse.variables.corequisiteId === corequisite.id &&
          unlinkCorequisiteFromCourse.variables.courseId === parentCourseId;

        return (
          <Indicator
            key={corequisite.id}
            size={14}
            color="gray"
            position="middle-start"
            offset={18}
            fw="bold"
            zIndex={0}
            inline
            label="CO"
          >
            <Pill
              onRemove={() => handleRemoveCorequisite(corequisiteId)}
              fw="normal"
              pl={35}
              disabled={isRemovingCorequisite}
              key={corequisite.id}
              withRemoveButton
            >
              {corequisite.code}
            </Pill>
          </Indicator>
        );
      })}

      <PrerequisiteMultiSelect
        studyPlan={studyPlan}
        courses={courses}
        parentCourseId={parentCourseId}
      />

      {(unlinkPrerequisiteFromCourse.isPending &&
        unlinkPrerequisiteFromCourse.variables.courseId === parentCourseId) ||
      (unlinkCorequisiteFromCourse.isPending &&
        unlinkCorequisiteFromCourse.variables.courseId === parentCourseId) ? (
        <Loader size={14} />
      ) : null}
    </Flex>
  );
}

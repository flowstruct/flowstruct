import { Group, Loader, Menu, ScrollArea, Text } from '@mantine/core';
import { useMoveCoursesToSection } from '@/features/study-plan/hooks/useMoveCoursesToSection.ts';
import { Check } from 'lucide-react';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import { getSectionDisplayName } from '@/utils/getSectionDisplayName.ts';

type SectionsComboboxProps = {
  courseId: number;
  sectionId: number;
};

export function SectionsMenuItems({ courseId, sectionId }: SectionsComboboxProps) {
  const moveCourseToSection = useMoveCoursesToSection();
  const { data: studyPlan } = useCurrentStudyPlan();

  const handleChangeCourseSection = (sectionId: number) => {
    moveCourseToSection.mutate({
      studyPlanId: studyPlan.id,
      courseIds: [courseId],
      sectionId,
    });
  };

  const options = studyPlan.sections.map((section) => {
    const isSelected = section.id === sectionId;

    return (
      <Menu.Item key={section.id} onClick={() => handleChangeCourseSection(section.id)}>
        <Group gap="xs">
          {isSelected && moveCourseToSection.isPending ? (
            <Loader size={14} color="gray" />
          ) : (
            isSelected && <Check color="gray" size={14} />
          )}
          <Text size="sm">{getSectionDisplayName(section)}</Text>
        </Group>
      </Menu.Item>
    );
  });

  return (
    <ScrollArea.Autosize mah={200} type="scroll" scrollbarSize={6}>
      {options}
    </ScrollArea.Autosize>
  );
}

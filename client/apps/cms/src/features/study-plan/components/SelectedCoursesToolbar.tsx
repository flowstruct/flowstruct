import classes from '@/features/study-plan/styles/SelectedCoursesToolbar.module.css';
import {
  ActionIcon,
  Combobox,
  Divider,
  Group,
  Pill,
  ScrollArea,
  Text,
  Tooltip,
  Transition,
  useCombobox,
} from '@mantine/core';
import { ArrowLeftRight, Trash } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { FrameworkCourse, StudyPlan } from '@/features/study-plan/types.ts';
import { useRemoveCoursesFromStudyPlan } from '@/features/study-plan/hooks/useRemoveCourseFromSection.ts';
import { openConfirmModal } from '@mantine/modals';
import { useMoveCoursesToSection } from '@/features/study-plan/hooks/useMoveCoursesToSection.ts';
import { getSectionDisplayName } from '@/utils/getSectionDisplayName.ts';
import { ModalHeader } from '@/shared/components/ModalHeader.tsx';

type Props = {
  table: Table<FrameworkCourse>;
  studyPlan: StudyPlan;
};

export function SelectedCoursesToolbar({ table, studyPlan }: Props) {
  const combobox = useCombobox();
  const removeCoursesFromStudyPlan = useRemoveCoursesFromStudyPlan();
  const moveCoursesToSection = useMoveCoursesToSection();

  const selectedRows = table.getSelectedRowModel().rows;

  const handleRemoveCourses = () =>
    removeCoursesFromStudyPlan.mutate(
      {
        courseIds: selectedRows.map((row) => row.original.id),
        studyPlanId: Number(studyPlan.id),
      },
      {
        onSuccess: () => {
          table.resetRowSelection();
        },
      }
    );

  const handleMoveCourses = (sectionId: number) => {
    moveCoursesToSection.mutate(
      {
        studyPlanId: Number(studyPlan.id),
        courseIds: selectedRows.map((row) => row.original.id),
        sectionId,
      },
      {
        onSuccess: () => {
          table.resetRowSelection();
        },
      }
    );

    combobox.closeDropdown();
  };

  return (
    <div className={classes.toolbarContainer}>
      <Transition transition="slide-up" mounted={selectedRows.length > 0}>
        {(transitionStyles) => (
          <div className={classes.container} style={transitionStyles}>
            <Pill size="md" withRemoveButton onRemove={() => table.resetRowSelection()}>
              {selectedRows.length} selected
            </Pill>
            <Divider orientation="vertical" />
            <Group gap="xs">
              <Combobox
                offset={{ mainAxis: 22 }}
                store={combobox}
                width={250}
                withArrow
                onOptionSubmit={(sectionId) => handleMoveCourses(Number(sectionId))}
              >
                <Combobox.Target>
                  <Tooltip label="Change section">
                    <ActionIcon
                      onClick={() => combobox.toggleDropdown()}
                      variant="default"
                      loading={moveCoursesToSection.isPending}
                    >
                      <ArrowLeftRight size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Combobox.Target>

                <Combobox.Dropdown>
                  <ScrollArea.Autosize mah={200} type="scroll" scrollbarSize={6}>
                    <Combobox.Options>
                      {studyPlan.sections.map((section) => (
                        <Combobox.Option key={section.id} value={String(section.id)}>
                          {getSectionDisplayName(section)}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </ScrollArea.Autosize>
                </Combobox.Dropdown>
              </Combobox>

              <Tooltip label="Remove">
                <ActionIcon
                  variant="default"
                  onClick={() =>
                    openConfirmModal({
                      title: <ModalHeader title="Please Confirm Your Action" />,
                      children: (
                        <Text size="sm">
                          Removing these courses will remove them from the program map and any
                          prerequisite relationships. Are you sure you want to proceed?
                        </Text>
                      ),
                      labels: { confirm: 'Remove Courses', cancel: 'Cancel' },
                      onConfirm: handleRemoveCourses,
                    })
                  }
                  loading={removeCoursesFromStudyPlan.isPending}
                >
                  <Trash color="red" size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </div>
        )}
      </Transition>
    </div>
  );
}

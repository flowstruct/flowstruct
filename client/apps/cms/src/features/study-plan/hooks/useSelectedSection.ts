import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import React from 'react';
import { Table } from '@tanstack/react-table';
import { FrameworkCourse } from '@/features/study-plan/types.ts';

export const useSelectedSection = (table: Table<FrameworkCourse>) => {
  const { data: studyPlan } = useCurrentStudyPlan();

  const columnFilters = table.getState().columnFilters;

  const selectedSectionId = React.useMemo(() => {
    return columnFilters.find((f) => f.id === 'section')?.value as number;
  }, [columnFilters]);

  const selectedSection =
    React.useMemo(() => {
      return studyPlan.sections.find((s) => s.id === selectedSectionId);
    }, [selectedSectionId, studyPlan.sections]) ?? null;

  const setSelectedSection = (sectionId: number | null) => {
    if (sectionId === null) {
      table.setColumnFilters([]);
      return;
    }
    table.setColumnFilters([{ id: 'section', value: sectionId }]);
  };

  return { selectedSection, setSelectedSection };
};

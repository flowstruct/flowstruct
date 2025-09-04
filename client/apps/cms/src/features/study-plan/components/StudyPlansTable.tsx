import { DataTable } from '@/shared/components/DataTable.tsx';
import { useStudyPlanList } from '@/features/study-plan/hooks/useStudyPlanList.ts';
import { useDataTable } from '@/shared/hooks/useDataTable.ts';
import { StudyPlanRow } from '@/features/study-plan/types.ts';
import React from 'react';
import { getStudyPlansTableColumns } from '@/features/study-plan/components/StudyPlansTableColumns.tsx';
import { useProgramList } from '@/features/program/hooks/useProgramList.ts';
import { Group, Stack } from '@mantine/core';
import { DataTableSearch } from '@/shared/components/DataTableSearch.tsx';
import { DataTablePagination } from '@/shared/components/DataTablePagination.tsx';
import { getProgramDisplayName } from '@/utils/getProgramDisplayName.ts';
import { StudyPlanYearFilter } from '@/features/study-plan/components/StudyPlanYearFilter.tsx';
import { ColumnFilterSelect } from '@/shared/components/ColumnFilterSelect.tsx';
import { GraduationCap } from 'lucide-react';
import { getStudyPlanRows } from '@/utils/getStudyPlanRows.ts';
import { StudyPlanArchiveFilter } from '@/features/study-plan/components/StudyPlanArchiveFilter.tsx';
import { useTableSearch } from '@/shared/hooks/useTableSearch.ts';

export function StudyPlansTable() {
  const { data: studyPlans } = useStudyPlanList();
  const { data: programs } = useProgramList();

  const columns = React.useMemo(() => getStudyPlansTableColumns(), []);
  const data: StudyPlanRow[] = getStudyPlanRows(studyPlans, programs);
  const table = useDataTable<StudyPlanRow>({
    data,
    columns,
    search: useTableSearch(),
    initialState: {
      sorting: [
        {
          id: 'updatedAt',
          desc: true,
        },
      ],
    },
  });

  return (
    <Stack>
      <Group>
        <StudyPlanArchiveFilter table={table} />

        <DataTableSearch width={500} table={table} placeholder="Search any study plan..." />

        <ColumnFilterSelect
          table={table}
          columnId="programName"
          data={programs.map((p) => getProgramDisplayName(p))}
          leftSection={<GraduationCap size={16} />}
          placeholder="Filter by program..."
          searchable
        />

        <StudyPlanYearFilter table={table} />
      </Group>

      <DataTable table={table} />

      <DataTablePagination table={table} />
    </Stack>
  );
}

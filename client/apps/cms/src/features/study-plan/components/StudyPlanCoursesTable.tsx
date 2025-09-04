import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { DataTable } from '@/shared/components/DataTable.tsx';
import { useDataTable } from '@/shared/hooks/useDataTable.ts';
import { DataTablePagination } from '@/shared/components/DataTablePagination.tsx';
import { DataTableSearch } from '@/shared/components/DataTableSearch.tsx';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import React from 'react';
import { getStudyPlanCoursesTableColumns } from '@/features/study-plan/components/StudyPlanCoursesTableColumns.tsx';
import { getSectionCode } from '@/utils/getSectionCode.ts';
import { FrameworkCourse } from '@/features/study-plan/types.ts';
import { useCurrentStudyPlanCourses } from '@/features/study-plan/hooks/useCurrentStudyPlanCourses.ts';
import { List, ListPlus } from 'lucide-react';
import { SelectedCoursesToolbar } from '@/features/study-plan/components/SelectedCoursesToolbar.tsx';
import { SectionColumnFilter } from '@/features/study-plan/components/SectionColumnFilter.tsx';
import { Link } from '@tanstack/react-router';
import { StudyPlanCourseAdder } from '@/features/study-plan/components/StudyPlanCourseAdder.tsx';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';
import { useTableSearch } from '@/shared/hooks/useTableSearch.ts';

export function StudyPlanCoursesTable() {
  const { data: studyPlan } = useCurrentStudyPlan();
  const { data: courses } = useCurrentStudyPlanCourses();

  const data = React.useMemo(() => {
    const rows: FrameworkCourse[] = [];

    studyPlan.sections.forEach((section) => {
      const sectionCode = getSectionCode(section);

      section.courses.forEach((courseId) => {
        const course = courses[Number(courseId)];
        if (!course) return;

        const prerequisites = studyPlan.coursePrerequisites[courseId];
        const corequisites = studyPlan.courseCorequisites[courseId];

        rows.push({
          ...course,
          prerequisites,
          corequisites,
          section: section.id,
          sectionCode: sectionCode,
        });
      });
    });

    return rows;
  }, [studyPlan, courses]);

  const columns = React.useMemo(() => getStudyPlanCoursesTableColumns(), []);

  const table = useDataTable<FrameworkCourse>({
    data,
    columns,
    search: useTableSearch(),
    getRowId: (originalRow) => String(originalRow.id),
    initialState: {
      sorting: [
        {
          id: 'code',
          desc: false,
        },
      ],
      globalFilter: '',
    },
  });

  if (studyPlan.sections.length === 0) {
    return (
      <Paper withBorder p="xl">
        <Stack align="center" gap="xs">
          <ListPlus size={32} />
          <Title order={2} fw={600}>
            Create a Section
          </Title>
          <Text mb="md" c="dimmed" size="sm">
            Create a section first to add courses to the study plan
          </Text>

          <Link
            params={{ studyPlanId: String(studyPlan.id) }}
            to="/study-plans/$studyPlanId/sections"
            search={DefaultSearchValues()}
          >
            <Button variant="outline" leftSection={<List size={18} />}>
              Go to Sections
            </Button>
          </Link>
        </Stack>
      </Paper>
    );
  }

  return (
    <>
      <SelectedCoursesToolbar table={table} studyPlan={studyPlan} />
      <Stack>
        <Group>
          <DataTableSearch placeholder="Search courses..." table={table} />

          <SectionColumnFilter table={table} sections={studyPlan.sections} />

          <StudyPlanCourseAdder />
        </Group>

        <DataTable table={table} />

        <DataTablePagination table={table} />
      </Stack>
    </>
  );
}

import { createFileRoute, Outlet } from '@tanstack/react-router';
import { StudyPlanCourseListQuery, StudyPlanQuery } from '@/features/study-plan/queries.ts';
import { ProgramQuery } from '@/features/program/queries.ts';
import { getProgramDisplayName } from '@/utils/getProgramDisplayName.ts';
import { getStudyPlanDisplayName } from '@/utils/getStudyPlanDisplayName.ts';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import { useCurrentProgram } from '@/features/program/hooks/useCurrentProgram.ts';
import { Divider, Group, Stack, Text, Title } from '@mantine/core';
import { PageHeaderWithBack } from '@/shared/components/PageHeaderWithBack.tsx';
import { ApprovalStatusBadge } from '@/shared/components/ApprovalStatusBadge.tsx';
import { LastUpdated } from '@/shared/components/LastUpdated.tsx';
import { PageLayout } from '@/shared/components/PageLayout.tsx';
import { StudyPlanTabs } from '@/features/study-plan/components/StudyPlanTabs.tsx';
import { CoursesGraphProvider } from '@/contexts/CoursesGraphContext.tsx';
import { StudyPlanOptionsMenu } from '@/features/study-plan/components/StudyPlanOptionsMenu.tsx';
import { ArchiveAlert } from '@/features/study-plan/components/ArchiveAlert.tsx';

function RouteComponent() {
  const { data: studyPlan } = useCurrentStudyPlan();
  const { data: program } = useCurrentProgram(studyPlan.program);

  const title = (
    <Stack gap={5}>
      <Title order={2} fw={600}>
        {getProgramDisplayName(program)}
      </Title>
      <Text c="dimmed" size="sm">
        {'Study Plan ' + getStudyPlanDisplayName(studyPlan)}
      </Text>
    </Stack>
  );

  const header = (
    <Stack>
      <ArchiveAlert studyPlan={studyPlan} />
      <Group justify="space-between">
        <Group gap="lg" wrap="nowrap">
          <PageHeaderWithBack title={title} linkProps={{ to: '/study-plans' }} />

          {ApprovalStatusBadge(studyPlan.status)}
        </Group>

        <Group mb="auto" justify="space-between">
          <LastUpdated at={studyPlan.updatedAt} by={studyPlan.updatedBy} />

          <StudyPlanOptionsMenu studyPlan={studyPlan} />
        </Group>
      </Group>
    </Stack>
  );

  return (
    <PageLayout header={header}>
      <StudyPlanTabs />

      <Divider />

      <CoursesGraphProvider>
        <Outlet />
      </CoursesGraphProvider>
    </PageLayout>
  );
}

export const Route = createFileRoute('/_layout/study-plans/$studyPlanId')({
  loader: async ({ context: { queryClient }, params }) => {
    const studyPlanId = Number(params.studyPlanId);

    queryClient.ensureQueryData(StudyPlanCourseListQuery(studyPlanId));

    const studyPlan = await queryClient.ensureQueryData(StudyPlanQuery(studyPlanId));
    queryClient.ensureQueryData(ProgramQuery(studyPlan.program));
  },
  component: RouteComponent,
});

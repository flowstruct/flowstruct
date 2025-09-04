import { createFileRoute } from '@tanstack/react-router';
import { useCurrentStudyPlan } from '@/features/study-plan/hooks/useCurrentStudyPlan.ts';
import { useCurrentProgram } from '@/features/program/hooks/useCurrentProgram.ts';
import { AppCard } from '@/shared/components/AppCard.tsx';
import { EditDetailsButton } from '@/shared/components/EditDetailsButton.tsx';
import { InfoItem } from '@/shared/components/InfoItem.tsx';
import { getProgramDisplayName } from '@/utils/getProgramDisplayName.ts';
import { Group } from '@mantine/core';
import { ArchiveStatusBadge } from '@/shared/components/ArchiveStatusBadge.tsx';

export const Route = createFileRoute('/_layout/study-plans/$studyPlanId/details/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: studyPlan } = useCurrentStudyPlan();
  const { data: program } = useCurrentProgram(studyPlan.program);

  return (
    <AppCard
      title="Study Plan Information"
      subtitle="Details about this study plan"
      headerAction={
        <EditDetailsButton
          to="/study-plans/$studyPlanId/details/edit"
          params={{ studyPlanId: String(studyPlan.id) }}
        />
      }
    >
      <InfoItem label="Program" value={getProgramDisplayName(program)} />

      <Group grow>
        <InfoItem label="Year" value={`${studyPlan.year} - ${studyPlan.year + 1}`} />
        <InfoItem label="Duration" value={`${studyPlan.duration} Years`} />
      </Group>

      <Group grow>
        <InfoItem label="Track" value={studyPlan.track ? studyPlan.track : '---'} />
        <InfoItem label="Status" value={<ArchiveStatusBadge archivedAt={studyPlan.archivedAt} />} />
      </Group>
    </AppCard>
  );
}
